import ApiHelper from "@src/Cores/Helpers/Api/ApiHelper";
import {
  CorePostCategoryEntity,
  CorePostCategoryFilter,
} from "@src/Cores/Services/Admin/Post/CorePostCategoryService";
import { SelectDataModel } from "@src/Cores/Types/SelectDataModel";

import { CancelTokenModel } from "../../CancelTokenService";

const CorePostCategoryInternalService = {
  //#region command section
  Add: async function (
    data: CorePostCategoryEntity,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<CorePostCategoryEntity>(
        "/api/CorePostCategoryInternal/Add",
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
        "/api/CorePostCategoryInternal/Update",
        data,
        {
          cancelToken,
        }
      )
    ).data;
  },

  Delete: async function (id?: string, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.delete(
        `/api/CorePostCategoryInternal/Delete/${id}`,
        undefined,
        {
          cancelToken,
        }
      )
    ).data;
  },

  UploadImage: async function (file: any, cancelToken?: CancelTokenModel) {
    const formData = new FormData();
    formData.append("file", file);
    return (
      await ApiHelper.postFile(
        "/api/CorePostCategoryInternal/UploadImage",
        formData,
        {
          cancelToken,
        }
      )
    ).data;
  },

  //#endregion

  //#region query section
  Get: async function (id?: string, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.get<CorePostCategoryEntity>(
        `/api/CorePostCategoryInternal/Get/${id}`,
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
        `/api/CorePostCategoryInternal/GetList/`,
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
        `/api/CorePostCategoryInternal/GetByUrlFriendly/${urlFriendly}`,
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
export default CorePostCategoryInternalService;
