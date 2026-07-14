import ApiHelper from "@src/Cores/Helpers/Api/ApiHelper";
import { BaseModel, FilterBaseModel } from "@src/Cores/Models/CommonModels";
import { SelectDataModel } from "@src/Cores/Types/SelectDataModel";

import { CancelTokenModel } from "../CancelTokenService";

//#region Models

export interface CoreUserEntity extends BaseModel {
  coreUserId?: string; //key
  identityId?: number;
  code?: string;
  userName?: string;
  fullName?: string;
  name?: string;
  lastName?: string;
  nickName?: string;
  email?: string;
  phone?: string;
  sexCode?: string;
  dateOfBirth?: Date;
  description?: string;
  isSystem?: boolean;
  isLocked?: boolean;
  isAdmin?: boolean;
  dayOfDie?: number;
  isHide?: number;

  listRoleId?: string[];
}

export interface CoreUserFilter extends FilterBaseModel {
  coreUserId?: string;
  userName?: string;
  fullName?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  isSystem?: boolean;
  isDisable?: boolean;
  isAdmin?: boolean;
  ignoreIds?: string[];
}

export interface ResetPasswordModalModel {
  coreUserId?: string;
  newPassword?: string;
}

export interface ChangePasswordModel {
  coreUserId?: string;
  oldPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export interface CoreUserViewModel {
  coreUserId?: string;
  identityId?: number;
  userName?: string;
  fullName?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  isSystem?: boolean;
  isLocked?: boolean;
  isAdmin?: boolean;
  insertTime?: Date;
}
//#endregion

const CoreUserService = {
  //#region command section
  Add: async function (data?: CoreUserEntity, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.post<CoreUserEntity>("/api/CoreUser/Add", data, {
        cancelToken,
      })
    ).data;
  },

  Update: async function (
    data?: CoreUserEntity,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.put<CoreUserEntity>("/api/CoreUser/Update", data, {
        cancelToken,
      })
    ).data;
  },

  Delete: async function (id?: string, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.delete(`/api/CoreUser/Delete/${id}`, undefined, {
        cancelToken,
      })
    ).data;
  },

  ChangePassword: async function (
    data?: ChangePasswordModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post(`/api/CoreUser/ChangePassword/`, data, {
        cancelToken,
      })
    ).data;
  },

  ResetPasswordOtherUser: async function (
    data?: ResetPasswordModalModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post(`/api/CoreUser/ResetPasswordOtherUser/`, data, {
        cancelToken,
      })
    ).data;
  },
  //#endregion

  //#region query section
  Get: async function (id?: string, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.get<CoreUserEntity>(
        `/api/CoreUser/Get/${id}`,
        undefined,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetList: async function (
    filter?: CoreUserFilter,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.get<CoreUserEntity[]>(`/api/CoreUser/GetList/`, filter, {
        cancelToken,
      })
    ).data;
  },

  GetListSelect: async function (
    filter?: CoreUserFilter,
    cancelToken?: CancelTokenModel
  ) {
    const response = await this.GetList(filter, cancelToken);
    const data: SelectDataModel[] = [];
    response.data?.forEach((element) => {
      data.push({
        value: element.coreUserId,
        label: element.fullName,
      });
    });
    return data;
  },

  GetListView: async function (
    filter?: CoreUserFilter,
    cancelToken?: CancelTokenModel
  ) {
    filter ??= {};
    filter.isAdmin = false;
    return (
      await ApiHelper.post<CoreUserViewModel[]>(
        "/api/CoreUser/GetListView",
        filter,
        { cancelToken }
      )
    ).data;
  },

  //#endregion
};
export default CoreUserService;
