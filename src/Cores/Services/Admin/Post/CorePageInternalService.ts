import ApiHelper from "@src/Cores/Helpers/Api/ApiHelper";
import { ChangeStatusModel } from "@src/Cores/Models/CommonModels";
import {
  CorePostEntity,
  CorePostFilter,
  PostViewModel,
} from "@src/Cores/Services/Admin/Post/CorePostService";

import { CancelTokenModel } from "../../CancelTokenService";

const CorePageInternalService = {
  //#region command section
  Add: async function (data?: CorePostEntity, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.post<CorePostEntity>("/api/CorePageInternal/Add", data, {
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
        "/api/CorePageInternal/Update",
        data,
        {
          cancelToken,
        }
      )
    ).data;
  },

  Delete: async function (id?: string, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.delete(`/api/CorePageInternal/Delete/${id}`, undefined, {
        cancelToken,
      })
    ).data;
  },

  UploadImage: async function (file: any, cancelToken?: CancelTokenModel) {
    const formData = new FormData();
    formData.append("file", file);
    return (
      await ApiHelper.postFile("/api/CorePageInternal/UploadImage", formData, {
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
        "/api/CorePageInternal/RequestApprove",
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
        "/api/CorePageInternal/CancelRequestApproval",
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
      await ApiHelper.post<boolean>("/api/CorePageInternal/Approve", data, {
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
        "/api/CorePageInternal/CancelApprove",
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
      await ApiHelper.post<boolean>("/api/CorePageInternal/Reject", data, {
        cancelToken,
      })
    ).data;
  },

  Publish: async function (
    data?: ChangeStatusModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<boolean>("/api/CorePageInternal/Publish", data, {
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
        "/api/CorePageInternal/CancelPublish",
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
      await ApiHelper.post<boolean>("/api/CorePageInternal/Cancel", data, {
        cancelToken,
      })
    ).data;
  },
  //#endregion

  //#region query section
  Get: async function (id?: string, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.get<CorePostEntity>(
        `/api/CorePageInternal/Get/${id}`,
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
        `/api/CorePageInternal/GetList/`,
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
        `/api/CorePageInternal/GetListLatest/`,
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
        `/api/CorePageInternal/GetListHot/`,
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
        `/api/CorePageInternal/GetListTrending/`,
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
        `/api/CorePageInternal/GetListSameCategory/`,
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
        `/api/CorePageInternal/GetByCodeAndView/${urlFriendly}`,
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
        `/api/CorePageInternal/GetListOverview/`,
        filter,
        {
          cancelToken,
        }
      )
    ).data;
  },
  //#endregion
};
export default CorePageInternalService;
