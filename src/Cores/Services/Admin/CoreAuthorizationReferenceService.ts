import ApiHelper from "@src/Cores/Helpers/Api/ApiHelper";
import {
  BaseModel,
  BaseNomalModel,
  FilterBaseModel,
} from "@src/Cores/Models/CommonModels";

import { CancelTokenModel } from "../CancelTokenService";
import { CoreMenuFilter, MenuAuthorizeTypeEnum } from "./CoreMenuService";
import { CoreRole_CoreUserEntity } from "./CoreRoleService";

//#region Models

export interface CoreAuthorizationReferenceEntity extends BaseModel {
  coreAthorizationReferenceId?: string;
  coreRoleId?: string;
  referenceId?: string;
  authorizationReferenceType?: string;
}

export interface AuthorizationReferenceViewModel
  extends CoreAuthorizationReferenceEntity {
  coreFeatureName?: string;
  coreFunctionName?: string;
  coreActionName?: string;
}

export interface AuthorizationMenuViewModel
  extends CoreAuthorizationReferenceEntity {
  coreMenuId?: string;
  parentId?: string;
  code?: string;
  name?: string;
  urlPath?: string;
  authorizeType?: MenuAuthorizeTypeEnum;
}

export interface CorePermissionEntity extends BaseNomalModel {
  corePermissionId?: string; //key
  coreFeatureCode?: string;
  coreFunctionCode?: string;
  coreActionCode?: string;
  coreFeatureName?: string;
  coreFunctionName?: string;
  coreActionName?: string;
}
export interface CorePermissionFilter extends FilterBaseModel {
  corePermissionId?: string;
  code?: string;
  coreFeatureCode?: string;
  coreFunctionCode?: string;
  coreActionCode?: string;
  ignoreIds?: string[];
}
//#endregion

const CoreAuthorizationReferenceService = {
  //#region command section
  AddListPermission: async function (
    coreRoleId?: string,
    data?: CoreAuthorizationReferenceEntity[],
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post(
        `/api/AuthorizationReference/AddListPermission/${coreRoleId}`,
        data,
        {
          cancelToken,
        }
      )
    ).data;
  },

  DeleteListPermission: async function (
    coreRoleId?: string,
    data?: CoreAuthorizationReferenceEntity[],
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post(
        `/api/AuthorizationReference/DeleteListPermission/${coreRoleId}`,
        data,
        {
          cancelToken,
        }
      )
    ).data;
  },

  AddListMenu: async function (
    coreRoleId?: string,
    data?: CoreAuthorizationReferenceEntity[],
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post(
        `/api/AuthorizationReference/AddListMenu/${coreRoleId}`,
        data,
        {
          cancelToken,
        }
      )
    ).data;
  },

  DeleteListMenu: async function (
    coreRoleId?: string,
    data?: CoreAuthorizationReferenceEntity[],
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post(
        `/api/AuthorizationReference/DeleteListMenu/${coreRoleId}`,
        data,
        {
          cancelToken,
        }
      )
    ).data;
  },

  AddListUser: async function (
    coreRoleId?: string,
    data?: CoreRole_CoreUserEntity[],
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post(
        `/api/AuthorizationReference/AddListUser/${coreRoleId}`,
        data,
        {
          cancelToken,
        }
      )
    ).data;
  },

  DeleteListUser: async function (
    coreRoleId?: string,
    data?: CoreRole_CoreUserEntity[],
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post(
        `/api/AuthorizationReference/DeleteListUser/${coreRoleId}`,
        data,
        {
          cancelToken,
        }
      )
    ).data;
  },
  //#endregion

  //#region query section
  GetListPermissionByRole: async function (
    coreRoleId?: string,
    filter?: CorePermissionFilter,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.get<AuthorizationReferenceViewModel[]>(
        `/api/AuthorizationReference/GetListPermissionByRole/${coreRoleId}`,
        filter,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetListMenuByRole: async function (
    coreRoleId?: string,
    filter?: CoreMenuFilter,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.get<AuthorizationMenuViewModel[]>(
        `/api/AuthorizationReference/GetListMenuByRole/${coreRoleId}`,
        filter,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetListUserByRole: async function (
    coreRoleId?: string,
    filter?: CoreMenuFilter,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.get<AuthorizationMenuViewModel[]>(
        `/api/AuthorizationReference/GetListUserByRole/${coreRoleId}`,
        filter,
        {
          cancelToken,
        }
      )
    ).data;
  },

  //#endregion
};
export default CoreAuthorizationReferenceService;
