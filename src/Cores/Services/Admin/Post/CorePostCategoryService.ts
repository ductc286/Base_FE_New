import ApiHelper from "@src/Cores/Helpers/Api/ApiHelper";
import { BaseModel, FilterBaseModel } from "@src/Cores/Models/CommonModels";
import { SelectDataModel } from "@src/Cores/Types/SelectDataModel";

import { CancelTokenModel } from "../../CancelTokenService";

//#region Models

export interface CorePostCategoryEntity extends BaseModel {
  corePostCategoryId?: string; //key
  code?: string;
  name?: string;
  urlFriendly?: string;
  note?: string;
  parentId?: string;
}

export interface CorePostCategoryFilter extends FilterBaseModel {
  categoryId?: string;
  code?: string;
  name?: string;
  urlFriendly?: string;
  parentId?: string;
  userInsertId?: string;
  userUpdateId?: string;
}

//#endregion

const CorePostCategoryService = {
  //#region command section
  Add: async function (
    data: CorePostCategoryEntity,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<CorePostCategoryEntity>(
        "/api/CorePostCategory/Add",
        data,
        {
          cancelToken,
        }
      )
    ).data;
  },

  Update: async function (
    data: CorePostCategoryEntity,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.put<CorePostCategoryEntity>(
        "/api/CorePostCategory/Update",
        data,
        {
          cancelToken,
        }
      )
    ).data;
  },

  Delete: async function (id?: string, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.delete(`/api/CorePostCategory/Delete/${id}`, undefined, {
        cancelToken,
      })
    ).data;
  },

  UploadImage: async function (file: any, cancelToken?: CancelTokenModel) {
    const formData = new FormData();
    formData.append("file", file);
    return (
      await ApiHelper.postFile("/api/CorePostCategory/UploadImage", formData, {
        cancelToken,
      })
    ).data;
  },

  //#endregion

  //#region query section
  Get: async function (id?: string, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.get<CorePostCategoryEntity>(
        `/api/CorePostCategory/Get/${id}`,
        undefined,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetList: async function (
    filter?: CorePostCategoryFilter,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.get<CorePostCategoryEntity[]>(
        `/api/CorePostCategory/GetList/`,
        filter,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetByUrlFriendly: async function (
    urlFriendly?: string,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.get<CorePostCategoryEntity>(
        `/api/CorePostCategory/GetByUrlFriendly/${urlFriendly}`,
        undefined,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetListSelect: async function (
    filter?: CorePostCategoryFilter,
    cancelToken?: CancelTokenModel
  ) {
    const response = await this.GetList(filter, cancelToken);
    const data: SelectDataModel[] = [];
    response.data?.forEach((element) => {
      data.push({
        value: element.corePostCategoryId,
        label: element.name,
      });
    });
    return data;
  },
  //#endregion
};
export default CorePostCategoryService;
