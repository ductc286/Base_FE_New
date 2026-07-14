import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

import GlobalConfig from "@src/AppForders/Configs/GlobalConfig";
import { CommonConst } from "@src/Cores/Constants";
import { NotifyTypeEnum } from "@src/Cores/Enums/CommonEnum";
import AuthorizeHelper from "@src/Cores/Helpers/AuthorizeHelper";
import CommonHelper from "@src/Cores/Helpers/CommonHelper";
import ToastHelper from "@src/Cores/Helpers/ToastHelper";
import {
  CodeResponseEnum,
  CustomConfigApiModel,
  ResponseBaseModel,
} from "@src/Cores/Models/CommonModels";
import {
  AppAuthenticationService,
  CancelTokenService,
} from "@src/Cores/Services";

const apiDefault = axios.create({
  baseURL: GlobalConfig.BASE_URL_API,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PATCH, PUT",
    "Access-Control-Allow-Credentials": true,
  },
  timeout: 180000, //3p
  paramsSerializer: {
    indexes: null, // no brackets at all
  },
  validateStatus: () => true,
});

const methodConst = {
  get: "get",
  post: "post",
  put: "put",
  delete: "delete",
};

const ApiHelper = {
  get: async function <TEntity = any>(
    url: string,
    params?: any,
    customConfig?: CustomConfigApiModel
  ) {
    return callApi<TEntity>(url, methodConst.get, null, params, customConfig);
  },

  post: async function <TEntity = any>(
    url: string,
    data?: any,
    customConfig?: CustomConfigApiModel
  ) {
    return await callApi<TEntity>(
      url,
      methodConst.post,
      data,
      null,
      customConfig
    );
  },

  postFile: async function <TEntity = any>(
    url: string,
    data: any,
    customConfig?: CustomConfigApiModel
  ) {
    return await callApi<TEntity>(
      url,
      methodConst.post,
      data,
      null,
      customConfig,
      true
    );
  },

  put: async function <TEntity = any>(
    url: string,
    data: any,
    customConfig?: CustomConfigApiModel
  ) {
    return await callApi<TEntity>(
      url,
      methodConst.put,
      data,
      null,
      customConfig
    );
  },

  delete: async function <TEntity = any>(
    url: string,
    data?: any,
    customConfig?: CustomConfigApiModel
  ) {
    return await callApi<TEntity>(
      url,
      methodConst.delete,
      data,
      null,
      customConfig
    );
  },
};

//#region Handle
async function callApi<TEntity>(
  url: string,
  method: string,
  data = null,
  params = null,
  customConfig?: CustomConfigApiModel,
  isFormData = false
) {
  //handle config common
  let config: ObjectModel = {};
  if (customConfig) {
    if (customConfig.cancelToken) {
      config.signal = CancelTokenService.signal(customConfig.cancelToken);
    }
  }
  config.url = url;
  config.method = method;

  if (params != null) {
    config.params = params;
  }
  if (
    method === methodConst.post ||
    method === methodConst.put ||
    method === methodConst.delete
  ) {
    config.data = data;
    // config.data = JSON.stringify(data)
  }
  //Gắn token khi gọi api
  // const tokenInfo = AuthorizeHelper.getTokenInfo();
  let tokenInfo = undefined;
  if (!isRefreshRequest(config.url)) {
    tokenInfo =
      await AppAuthenticationService.RefreshTokenIfAccessTokenExpired();
  } else {
    tokenInfo = await AuthorizeHelper.getTokenInfo();
  }

  if (!CommonHelper.isNull(tokenInfo)) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${tokenInfo?.accessToken}`,
    };
  }
  if (isFormData) {
    config.headers = {
      ...config.headers,
      "Content-Type": "multipart/form-data",
    };
  }

  return await excuteCallApi<TEntity>(config);
}

function isRefreshRequest(url?: string) {
  return /^.*(api\/AppAuthentication\/RefreshToken).*$/.test(url ?? "");
}

async function excuteCallApi<TEntity>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<ResponseBaseModel<TEntity>, any>> {
  try {
    const response =
      await apiDefault.request<ResponseBaseModel<TEntity>>(config);
    // console.log("response.data.", response.data);
    if (!response.data.isSuccess) {
      await handleApiUnsuccessful<TEntity>(response);
      // console.log("handleApiUnsuccessful");
    }
    return response;
  } catch (error) {
    // console.log("errorerror");
    const axiosError = error as AxiosError<ResponseBaseModel<TEntity>>;
    await handleErrorApi<AxiosError<ResponseBaseModel<TEntity>>>(error, config);

    return await getFakeResponseWhenError(axiosError, config);
  }
}

async function handleApiUnsuccessful<TEntity>(
  response: AxiosResponse<ResponseBaseModel<TEntity>, any>
) {
  //const errStr = responseModel.actionCode + " - " + responseModel.message;
  let errStr = "";
  if (response.status === 400) {
    const responseModel = response.data;
    errStr = `${responseModel.message} (mã lỗi:${responseModel.actionCode})`;
  } else if (response.status === 401) {
    errStr = `Không có quyền truy cập hoặc phiên đăng nhập hết hạn`;
    handleUnauthorized();
    return;
  } else {
    errStr = `Có lỗi xảy ra, vui lòng thử lại sau`;
  }
  ToastHelper.toast(NotifyTypeEnum.error, errStr);
}

function handleUnauthorized() {
  const isClient = typeof window !== "undefined";
  const regex401 = new RegExp(`^${CommonConst.url.page401}`);
  const regexLogin = new RegExp(`^${CommonConst.url.login}`);
  const curentUrl = window.location.pathname;
  if (isClient && !regex401.test(curentUrl) && !regexLogin.test(curentUrl)) {
    const url = curentUrl
      ? CommonConst.url.login +
        "?redirect=" +
        encodeURIComponent(window.location.toString())
      : CommonConst.url.login;
    window.location.href = url;
  }
}

async function handleErrorApi<TEntity>(error: any, config: any) {
  // console.log(`ApiHelper - ${config.url} - handleErrorApi - error`, error);

  if (!axios.isAxiosError(error)) {
    return;
  }
  let errStr: string | undefined = "";

  //TH cancel token
  if (error.code === "ERR_CANCELED") {
    return;
  }

  //Xử lý lỗi khi nhận được response
  if (error.response) {
    if (error.response.status === 401) {
      handleUnauthorized();
      return;
    } else if (error.response.data.statusCode === undefined) {
      errStr = `Có lỗi xảy ra`;
    } else {
      errStr = `${error.response?.data?.message} (mã lỗi:${error.response?.data?.actionCode})`;
    }
  }
  // Xử lý lỗi khác
  else errStr = error.message;

  ToastHelper.toast(NotifyTypeEnum.error, errStr);
}

async function getFakeResponseWhenError<TEntity>(
  error: AxiosError<ResponseBaseModel<TEntity>>,
  config: any
) {
  const configFake: any = { ...config };
  const fakeResponse: AxiosResponse<ResponseBaseModel<TEntity>, any> = {
    data: {
      isSuccess: false,
      statusCode: CodeResponseEnum.ErrorGeneral,
      code: CodeResponseEnum[CodeResponseEnum.ErrorGeneral],
    }, // dữ liệu trả về từ API
    status: error?.status ?? 400, // mã HTTP của phản hồi
    statusText: "ERROR", // thông báo mã HTTP của phản hồi
    headers: {}, // tiêu đề của phản hồi
    config: configFake, // cấu hình yêu cầu Axios
  };

  //TH cancel token
  if (error.code === "ERR_CANCELED") {
    fakeResponse.data.statusCode = CodeResponseEnum.CancellationToken;
    fakeResponse.data.code =
      CodeResponseEnum[CodeResponseEnum.CancellationToken];
  }

  return fakeResponse;
}

//#endregion

export default ApiHelper;
