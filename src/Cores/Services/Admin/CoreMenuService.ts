import ApiHelper from "@src/Cores/Helpers/Api/ApiHelper";
import {
  BaseModel,
  FilterBaseModel,
  ResponseBaseModel,
} from "@src/Cores/Models/CommonModels";
import { SelectDataModel } from "@src/Cores/Types/SelectDataModel";

import { CancelTokenModel } from "../CancelTokenService";

//#region models
export enum MenuTypeCodeEnum {
  menuDefault = 0,
  menuAdmin = 1,
  /// <summary>
  /// Page admin, không hiển thị lên menu, chỉ để phân quyền vào, các trang như thêm,sửa,chi tiết
  /// </summary>
  pageAdmin = 2,
  /// <summary>
  /// Page người dùng bên ngoài, không hiển thị lên menu, chỉ để phân quyền vào, các trang như thêm,sửa,chi tiết
  /// </summary>
  pageDefault = 3,
}

export enum MenuAuthorizeTypeEnum {
  anonymous = 0,
  logged = 1,
  authorize = 2,
}

export interface CoreMenuEntity extends BaseModel {
  coreMenuId?: string;
  code?: string;
  name?: string;
  urlPath?: string;
  parentId?: string;
  isLocked?: boolean;
  isHide?: boolean;
  ordinal?: boolean;
  levelItem?: number;
  menuTypeCode?: string;
  description?: string;
  icon?: string;
  className?: string;
  authorizeType?: MenuAuthorizeTypeEnum;

  listChild?: CoreMenuEntity[];
}

export interface CoreMenuFilter extends FilterBaseModel {
  coreMenuId?: string;
  code?: string;
  name?: string;
  urlPath?: string;
  parentId?: string;
  isLocked?: boolean;
  isHide?: boolean;
  levelItem?: number;
  menuTypeCode?: string;
  ignoreIds?: string[];
  authorizeType?: MenuAuthorizeTypeEnum;
}
//#endregion

const CoreMenuService = {
  //#region command section
  Add: async function (data?: CoreMenuEntity, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.post<CoreMenuEntity>("/api/CoreMenu/Add", data, {
        cancelToken,
      })
    ).data;
  },

  Update: async function (
    data?: CoreMenuEntity,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.put<CoreMenuEntity>("/api/CoreMenu/Update", data, {
        cancelToken,
      })
    ).data;
  },

  Delete: async function (id?: string, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.delete(`/api/CoreMenu/Delete/${id}`, undefined, {
        cancelToken,
      })
    ).data;
  },
  //#endregion

  //#region query section
  Get: async function (id?: string, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.get<CoreMenuEntity>(
        `/api/CoreMenu/Get/${id}`,
        undefined,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetList: async function (
    filter?: CoreMenuFilter,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.get<CoreMenuEntity[]>("/api/CoreMenu/GetList", filter, {
        cancelToken,
      })
    ).data;
  },

  GetListSelect: async function (
    filter?: CoreMenuFilter,
    cancelToken?: CancelTokenModel
  ) {
    const response: ResponseBaseModel<CoreMenuEntity[]> = await this.GetList(
      filter,
      cancelToken
    );
    const ret: SelectDataModel[] = [];
    response.data?.forEach((element) => {
      ret.push({
        value: element.coreMenuId,
        label: element.name,
      });
    });
    return ret;
  },

  GetListMenuAdmin: async function (cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.get<CoreMenuEntity[]>(
        "/api/CoreMenu/GetListMenuAdmin",
        undefined,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetListMenuDefault: async function (cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.get<CoreMenuEntity[]>(
        "/api/CoreMenu/GetListMenuDefault",
        undefined,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetListNeedAuthorization: async function (
    filter?: CoreMenuFilter,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<CoreMenuEntity[]>(
        "/api/CoreMenu/GetListNeedAuthorization",
        filter,
        {
          cancelToken,
        }
      )
    ).data;
  },

  //#endregion
};
export default CoreMenuService;
