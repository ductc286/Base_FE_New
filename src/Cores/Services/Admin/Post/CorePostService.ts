import ApiHelper from "@src/Cores/Helpers/Api/ApiHelper";
import {
  BaseModel,
  BaseNomalModel,
  ChangeStatusModel,
  FilterBaseModel,
} from "@src/Cores/Models/CommonModels";

import { CancelTokenModel } from "../../CancelTokenService";

//#region Models

export enum CorePostStatusEnum {
  draf = 1,
  pendingApproval = 2,
  reject = 3,
  approved = 8,
  published = 10,
  cancel = 20,
}

export enum CorePostTypeChangeStatusEnum {
  requestApproval = 2,
  cancelrequestApproval = 3,
  reject = 4,
  approval = 8,
  cancelApproval = 9,
  publish = 10,
  cancelPublish = 11,
  edit = 12,
  add = 13,
  cancel = 20,
}

export interface CorePostStatusHistoryEntity extends BaseModel {
  corePostStatusHistoryId?: string; //key
  corePostId?: string;
  status?: CorePostStatusEnum;
  type?: CorePostTypeChangeStatusEnum;
  note?: string;
  userIdChangeStatus?: string;
  timeChangeStatus?: Date;
  dataExtend?: string;
  statusText?: string;
  typeText?: boolean;
}

export interface CorePostEntity extends BaseModel {
  corePostId?: string; //key
  code?: string;
  name?: string;
  postStatusCode?: string;
  urlFriendly?: string;
  description?: string;
  corePostCategoryId?: string;
  urlAvatar?: string;
  content?: string;
  isLocked?: boolean;

  statusText?: string;
  statusHistory?: CorePostStatusHistoryEntity[];
}

export interface CorePostFilter extends FilterBaseModel {
  corePostId?: string;
  code?: string;
  name?: string;
  urlFriendly?: string;
  categoryId?: string;
  isLocked?: boolean;
  listIgrone?: string[];
  codeOfCurrentPostView?: string;
  typeList?: string;
  urlFriendlyOfCategory?: string;
}

export interface PostViewModel extends BaseNomalModel {
  corePostId?: string;
  code?: string;
  name?: string;
  postStatusCode?: string;
  urlFriendly?: string;
  description?: string;
  urlAvatar?: string;
  content?: string;
  userInsertId?: string;
  insertTime?: Date;
}

//#endregion

const CorePostService = {
  //#region command section
  Add: async function (data?: CorePostEntity, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.post<CorePostEntity>("/api/CorePost/Add", data, {
        cancelToken,
      })
    ).data;
  },

  Update: async function (
    data?: CorePostEntity,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.put<CorePostEntity>("/api/CorePost/Update", data, {
        cancelToken,
      })
    ).data;
  },

  Delete: async function (id?: string, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.delete(`/api/CorePost/Delete/${id}`, undefined, {
        cancelToken,
      })
    ).data;
  },

  UploadImage: async function (file: any, cancelToken?: CancelTokenModel) {
    const formData = new FormData();
    formData.append("file", file);
    return (
      await ApiHelper.postFile("/api/CorePost/UploadImage", formData, {
        cancelToken,
      })
    ).data;
  },

  RequestApprove: async function (
    data?: ChangeStatusModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<boolean>("/api/CorePost/RequestApprove", data, {
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
        "/api/CorePost/CancelRequestApproval",
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
      await ApiHelper.post<boolean>("/api/CorePost/Approve", data, {
        cancelToken,
      })
    ).data;
  },

  CancelApprove: async function (
    data?: ChangeStatusModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<boolean>("/api/CorePost/CancelApprove", data, {
        cancelToken,
      })
    ).data;
  },

  Reject: async function (
    data?: ChangeStatusModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<boolean>("/api/CorePost/Reject", data, {
        cancelToken,
      })
    ).data;
  },

  Publish: async function (
    data?: ChangeStatusModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<boolean>("/api/CorePost/Publish", data, {
        cancelToken,
      })
    ).data;
  },

  CancelPublish: async function (
    data?: ChangeStatusModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<boolean>("/api/CorePost/CancelPublish", data, {
        cancelToken,
      })
    ).data;
  },

  Cancel: async function (
    data?: ChangeStatusModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<boolean>("/api/CorePost/Cancel", data, {
        cancelToken,
      })
    ).data;
  },
  //#endregion

  //#region query section
  Get: async function (id?: string, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.get<CorePostEntity>(
        `/api/CorePost/Get/${id}`,
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
      await ApiHelper.get<CorePostEntity[]>(`/api/CorePost/GetList/`, filter, {
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
        `/api/CorePost/GetListLatest/`,
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
        `/api/CorePost/GetListHot/`,
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
        `/api/CorePost/GetListTrending/`,
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
        `/api/CorePost/GetListSameCategory/`,
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
        `/api/CorePost/GetByCodeAndView/${urlFriendly}`,
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
        `/api/CorePost/GetListOverview/`,
        filter,
        {
          cancelToken,
        }
      )
    ).data;
  },
  //#endregion
};
export default CorePostService;
