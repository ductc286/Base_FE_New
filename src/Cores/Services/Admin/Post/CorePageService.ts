import ApiHelper from "@src/Cores/Helpers/Api/ApiHelper";
import { ChangeStatusModel } from "@src/Cores/Models/CommonModels";
import {
  CorePostEntity,
  CorePostFilter,
  PostViewModel,
} from "@src/Cores/Services/Admin/Post/CorePostService";

import { CancelTokenModel } from "../../CancelTokenService";

const CorePageService = {
  //#region command section
  Add: async function (data?: CorePostEntity, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.post<CorePostEntity>("/api/CorePage/Add", data, {
        cancelToken,
      })
    ).data;
  },

  Update: async function (
    data?: CorePostEntity,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.put<CorePostEntity>("/api/CorePage/Update", data, {
        cancelToken,
      })
    ).data;
  },

  Delete: async function (id?: string, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.delete(`/api/CorePage/Delete/${id}`, undefined, {
        cancelToken,
      })
    ).data;
  },

  UploadImage: async function (file: any, cancelToken?: CancelTokenModel) {
    const formData = new FormData();
    formData.append("file", file);
    return (
      await ApiHelper.postFile("/api/CorePage/UploadImage", formData, {
        cancelToken,
      })
    ).data;
  },

  RequestApprove: async function (
    data?: ChangeStatusModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<boolean>("/api/CorePage/RequestApprove", data, {
        cancelToken,
      })
    ).data;
  },

  CancelRequestApproval: async function (
    data?: ChangeStatusModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<boolean>(
        "/api/CorePage/CancelRequestApproval",
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
      await ApiHelper.post<boolean>("/api/CorePage/Approve", data, {
        cancelToken,
      })
    ).data;
  },

  CancelApprove: async function (
    data?: ChangeStatusModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<boolean>("/api/CorePage/CancelApprove", data, {
        cancelToken,
      })
    ).data;
  },

  Reject: async function (
    data?: ChangeStatusModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<boolean>("/api/CorePage/Reject", data, {
        cancelToken,
      })
    ).data;
  },

  Publish: async function (
    data?: ChangeStatusModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<boolean>("/api/CorePage/Publish", data, {
        cancelToken,
      })
    ).data;
  },

  CancelPublish: async function (
    data?: ChangeStatusModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<boolean>("/api/CorePage/CancelPublish", data, {
        cancelToken,
      })
    ).data;
  },

  Cancel: async function (
    data?: ChangeStatusModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<boolean>("/api/CorePage/Cancel", data, {
        cancelToken,
      })
    ).data;
  },
  //#endregion

  //#region query section
  Get: async function (id?: string, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.get<CorePostEntity>(
        `/api/CorePage/Get/${id}`,
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
      await ApiHelper.get<CorePostEntity[]>(`/api/CorePage/GetList/`, filter, {
        cancelToken,
      })
    ).data;
  },

  GetListLatest: async function (
    filter?: CorePostFilter,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.get<PostViewModel[]>(
        `/api/CorePage/GetListLatest/`,
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
        `/api/CorePage/GetListHot/`,
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
        `/api/CorePage/GetListTrending/`,
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
        `/api/CorePage/GetListSameCategory/`,
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
        `/api/CorePage/GetByCodeAndView/${urlFriendly}`,
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
        `/api/CorePage/GetListOverview/`,
        filter,
        {
          cancelToken,
        }
      )
    ).data;
  },
  //#endregion
};
export default CorePageService;
