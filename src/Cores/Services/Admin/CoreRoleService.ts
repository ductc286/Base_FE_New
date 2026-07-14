import ApiHelper from "@src/Cores/Helpers/Api/ApiHelper";
import { BaseModel, FilterBaseModel } from "@src/Cores/Models/CommonModels";
import { SelectDataModel } from "@src/Cores/Types/SelectDataModel";

import { CancelTokenModel } from "../CancelTokenService";
import { CoreUserViewModel } from "./CoreUserService";

//#region Models

export interface CoreRoleEntity extends BaseModel {
  coreRoleId?: string; //key
  code?: string;
  name?: string;
  description?: string;
  isLocked?: boolean;
  isSystem?: boolean;
  isAdmin?: boolean;
  dayOfDie?: number;
  isHide?: number;

  listRoleId?: string[];
}

export interface CoreRoleFilter extends FilterBaseModel {
  coreRoleId?: string;
  code?: string;
  name?: string;
  isSystem?: boolean;
  isDisable?: boolean;
  isAdmin?: boolean;
}

export interface CoreRole_CoreUserEntity extends BaseModel {
  id?: string;
  coreRoleId?: string;
  coreUserId?: string;
}

export interface CoreRoleUserModel extends CoreUserViewModel {
  id?: string;
  coreRoleId?: string;
}

//#endregion

const CoreRoleService = {
  //#region command section
  Add: async function (data?: CoreRoleEntity, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.post<CoreRoleEntity>("/api/CoreRole/Add", data, {
        cancelToken,
      })
    ).data;
  },

  Update: async function (
    data?: CoreRoleEntity,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.put<CoreRoleEntity>("/api/CoreRole/Update", data, {
        cancelToken,
      })
    ).data;
  },

  Delete: async function (id?: string, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.delete(`/api/CoreRole/Delete/${id}`, undefined, {
        cancelToken,
      })
    ).data;
  },

  AddListUser: async function (
    data?: CoreRole_CoreUserEntity[],
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post(`/api/CoreRole/AddListUser`, data, {
        cancelToken,
      })
    ).data;
  },

  DeleteListUser: async function (
    data?: CoreRole_CoreUserEntity[],
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post(`/api/CoreRole/DeleteListUser`, data, {
        cancelToken,
      })
    ).data;
  },

  //#endregion

  //#region query section
  Get: async function (id?: string, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.get<CoreRoleEntity>(
        `/api/CoreRole/Get/${id}`,
        undefined,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetList: async function (
    filter?: CoreRoleFilter,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.get<CoreRoleEntity[]>(`/api/CoreRole/GetList`, filter, {
        cancelToken,
      })
    ).data;
  },

  GetListUser: async function (
    coreRoleId: string,
    filter?: CoreRoleFilter,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.get<CoreRoleUserModel[]>(
        `/api/CoreRole/GetListUser/${coreRoleId}`,
        filter,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetListSelect: async function (
    filter?: CoreRoleFilter,
    cancelToken?: CancelTokenModel
  ) {
    const response = await this.GetList(filter, cancelToken);
    const data: SelectDataModel[] = [];
    response.data?.forEach((element) => {
      data.push({
        value: element.coreRoleId,
        label: element.name,
        modelValue: element,
      });
    });
    return data;
  },

  //#endregion
};
export default CoreRoleService;
