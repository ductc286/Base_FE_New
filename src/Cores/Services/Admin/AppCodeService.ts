import ApiHelper from "@src/Cores/Helpers/Api/ApiHelper";
import {
  BaseNomalModel,
  FilterBaseModel,
} from "@src/Cores/Models/CommonModels";
import { CancelTokenModel } from "@src/Cores/Services/CancelTokenService";
import { SelectDataModel } from "@src/Cores/Types/SelectDataModel";

//#region Models

export interface CoreAppCodeEntity extends BaseNomalModel {
  appCodeId?: string; //key
  codeType?: string;
  codeValue?: string;
  name?: string;
  ordinal?: number;
  description?: string;
}

export interface CoreAppCodeFilter extends FilterBaseModel {
  appCodeId?: string;
  codeType?: string;
  codeValue?: string;
  name?: string;
  ordinal?: number;
}

//#endregion

const CoreAppCodeService = {
  //#region command section
  Add: async function (
    data?: CoreAppCodeEntity,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<CoreAppCodeEntity>("/api/AppCode/Add", data, {
        cancelToken,
      })
    ).data;
  },

  Update: async function (
    data?: CoreAppCodeEntity,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.put<CoreAppCodeEntity>("/api/AppCode/Update", data, {
        cancelToken,
      })
    ).data;
  },

  Delete: async function (id?: string, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.delete(`/api/AppCode/Delete/${id}`, undefined, {
        cancelToken,
      })
    ).data;
  },

  //#endregion

  //#region query section
  Get: async function (id?: string, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.get<CoreAppCodeEntity>(
        `/api/AppCode/Get/${id}`,
        undefined,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetList: async function (
    filter?: CoreAppCodeFilter,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.get<CoreAppCodeEntity[]>(
        `/api/AppCode/GetList/`,
        filter,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetListSelect: async function (
    filter?: CoreAppCodeFilter,
    cancelToken?: CancelTokenModel
  ) {
    const response = await this.GetList(filter, cancelToken);
    const data: SelectDataModel[] = [];
    response.data?.forEach((element) => {
      data.push({
        value: element.codeValue,
        label: element.name,
      });
    });
    return data;
  },
  //#endregion
};
export default CoreAppCodeService;
