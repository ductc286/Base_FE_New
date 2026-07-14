import { AuthorizeHelper } from "@src/Cores/Helpers";
import ApiHelper from "@src/Cores/Helpers/Api/ApiHelper";
import {
  AuthorizeActionModel,
  AuthorizeModel,
} from "@src/Cores/Models/CommonModels";

import { CancelTokenModel } from "../CancelTokenService";

//#region Models

export interface SignInMode {
  userName?: string;
  password?: string;
  name?: string;
}

export interface AuthorizeUser {
  userId?: string;
  userName?: string;
  nickName?: string;
  email?: string;
  fullName?: string;
}

export interface AuthorizeInfoModel {
  listUrl?: string[];
  userInfo?: AuthorizeUser;
  authorizeActions?: AuthorizeActionModel[];
}

export interface TokenModel {
  accessToken?: string;
  refreshToken?: string;
  userName?: string;
  userId?: string;
  expireTime?: Date;
  expireTimeRefreshToken?: Date;
}

export interface MyAuthenticationResponeModel {
  token?: TokenModel;
  authorizeInfo?: AuthorizeInfoModel;
}

//#endregion

const AppAuthenticationService = {
  //#region command section
  signIn: async function (data?: SignInMode, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.post<MyAuthenticationResponeModel>(
        "/api/AppAuthentication/SignIn",
        data,
        {
          cancelToken,
        }
      )
    ).data;
  },

  RefreshToken: async function (
    refreshToken?: string,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.get<MyAuthenticationResponeModel>(
        "/api/AppAuthentication/RefreshToken",
        { refreshToken },
        {
          cancelToken,
        }
      )
    ).data;
  },

  RefreshTokenIfAccessTokenExpired: async function (
    cancelToken?: CancelTokenModel
  ) {
    const tokenInfo = AuthorizeHelper.getTokenInfo();
    const currentTime = new Date();
    if (
      tokenInfo?.expireTime &&
      tokenInfo?.expireTimeRefreshToken &&
      currentTime > tokenInfo?.expireTime &&
      currentTime < tokenInfo?.expireTimeRefreshToken
    ) {
      const refreshResponse = await AppAuthenticationService.RefreshToken(
        tokenInfo?.refreshToken,
        cancelToken
      );
      if (refreshResponse.isSuccess) {
        AuthorizeHelper.setTokenInfo(refreshResponse.data?.token);
        return refreshResponse.data?.token;
      }
    }
    return tokenInfo;
  },
  //#endregion

  //#region query section
  GetAuthorizeInfo: async function (cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.get<AuthorizeInfoModel>(
        `/api/AppAuthentication/GetAuthorizeInfo`,
        undefined,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetAuthorizeAction: async function (
    featureCode?: string,
    recordId?: string,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.get<AuthorizeModel>(
        `/api/AppAuthentication/GetAuthorizeAction/`,
        { featureCode, recordId },
        {
          cancelToken,
        }
      )
    ).data;
  },

  //#endregion
};
export default AppAuthenticationService;
