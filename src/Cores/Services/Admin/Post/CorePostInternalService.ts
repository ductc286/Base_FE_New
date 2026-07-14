import ApiHelper from "@src/Cores/Helpers/Api/ApiHelper";
import { ChangeStatusModel } from "@src/Cores/Models/CommonModels";
import {
  CorePostEntity,
  CorePostFilter,
  PostViewModel,
} from "@src/Cores/Services/Admin/Post/CorePostService";

import { CancelTokenModel } from "../../CancelTokenService";

const CorePostInternalService = {
  //#region command section
  Add: async function (data?: CorePostEntity, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.post<CorePostEntity>("/api/CorePostInternal/Add", data, {
        cancelToken,
      })
    ).data;
  },

  Update: async function (
    data?: CorePostEntity,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.put<CorePostEntity>(
        "/api/CorePostInternal/Update",
        data,
        {
          cancelToken,
        }
      )
    ).data;
  },

  Delete: async function (id?: string, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.delete(`/api/CorePostInternal/Delete/${id}`, undefined, {
        cancelToken,
      })
    ).data;
  },

  UploadImage: async function (file: any, cancelToken?: CancelTokenModel) {
    const formData = new FormData();
    formData.append("file", file);
    return (
      await ApiHelper.postFile("/api/CorePostInternal/UploadImage", formData, {
        cancelToken,
      })
    ).data;
  },

  RequestApprove: async function (
    data?: ChangeStatusModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<boolean>(
        "/api/CorePostInternal/RequestApprove",
        data,
        {
          cancelToken,
        }
      )
    ).data;
  },

  CancelRequestApproval: async function (
    data?: ChangeStatusModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<boolean>(
        "/api/CorePostInternal/CancelRequestApproval",
        data,
        {
          cancelToken,
        }
      )
    ).data;
  },

  Approve: async function (
    data?: ChangeStatusModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<boolean>("/api/CorePostInternal/Approve", data, {
        cancelToken,
      })
    ).data;
  },

  CancelApprove: async function (
    data?: ChangeStatusModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<boolean>(
        "/api/CorePostInternal/CancelApprove",
        data,
        {
          cancelToken,
        }
      )
    ).data;
  },

  Reject: async function (
    data?: ChangeStatusModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<boolean>("/api/CorePostInternal/Reject", data, {
        cancelToken,
      })
    ).data;
  },

  Publish: async function (
    data?: ChangeStatusModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<boolean>("/api/CorePostInternal/Publish", data, {
        cancelToken,
      })
    ).data;
  },

  CancelPublish: async function (
    data?: ChangeStatusModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<boolean>(
        "/api/CorePostInternal/CancelPublish",
        data,
        {
          cancelToken,
        }
      )
    ).data;
  },

  Cancel: async function (
    data?: ChangeStatusModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<boolean>("/api/CorePostInternal/Cancel", data, {
        cancelToken,
      })
    ).data;
  },
  //#endregion

  //#region query section
  Get: async function (id?: string, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.get<CorePostEntity>(
        `/api/CorePostInternal/Get/${id}`,
        undefined,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetList: async function (
    filter?: CorePostFilter,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.get<CorePostEntity[]>(
        `/api/CorePostInternal/GetList/`,
        filter,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetListLatest: async function (
    filter?: CorePostFilter,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.get<PostViewModel[]>(
        `/api/CorePostInternal/GetListLatest/`,
        filter,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetListHot: async function (
    filter?: CorePostFilter,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.get<PostViewModel[]>(
        `/api/CorePostInternal/GetListHot/`,
        filter,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetListTrending: async function (
    filter?: CorePostFilter,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.get<PostViewModel[]>(
        `/api/CorePostInternal/GetListTrending/`,
        filter,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetListSameCategory: async function (
    filter?: CorePostFilter,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.get<PostViewModel[]>(
        `/api/CorePostInternal/GetListSameCategory/`,
        filter,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetByCodeAndView: async function (
    urlFriendly?: string,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.get<PostViewModel>(
        `/api/CorePostInternal/GetByCodeAndView/${urlFriendly}`,
        undefined,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetListOverview: async function (
    filter?: CorePostFilter,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.get<PostViewModel[]>(
        `/api/CorePostInternal/GetListOverview/`,
        filter,
        {
          cancelToken,
        }
      )
    ).data;
  },
  //#endregion
};
export default CorePostInternalService;
