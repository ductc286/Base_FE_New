import ApiHelper from "@src/Cores/Helpers/Api/ApiHelper";
import {
  BaseNomalModel,
  FilterBaseModel,
} from "@src/Cores/Models/CommonModels";

import { CancelTokenModel } from "../CancelTokenService";

//#region Models

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

const CorePermissionService = {
  //#region query section
  GetListView: async function (
    filter?: CorePermissionFilter,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.get<CorePermissionEntity[]>(
        `/api/CorePermission/GetListView/`,
        filter,
        {
          cancelToken,
        }
      )
    ).data;
  },

  //#endregion
};
export default CorePermissionService;
