//#region Models

import ApiHelper from "@src/Cores/Helpers/Api/ApiHelper";
import { BaseModel, FilterBaseModel } from "@src/Cores/Models/CommonModels";
import { CancelTokenModel } from "@src/Cores/Services/CancelTokenService";
import { SelectDataModel } from "@src/Cores/Types/SelectDataModel";

export interface MemberModel extends BaseModel {
  memberId?: string;
  coreUserId?: string;
  currentAddress?: string;
  parentId?: string;
  spouseId?: string;
  isInternal?: boolean;
  levelItem?: number;
  yearOfBirth?: number;
  urlAvatar?: string;
  career?: string;
  burialGround?: string; //Nơi chôn cất
  yearOfDie?: number;
  isDie?: boolean;

  homeTown?: string;
  dateOfDie?: Date;
  isFullDateOfBirth?: boolean;
  isFullDateOfDie?: boolean;
  dayOfDie?: number;
  monthOfDie?: number;
  ordinal?: number;
}

export interface MemberFamilyModel {
  memberIdSource?: string;
  memberId?: string;
  fullName?: string;
  nickName?: string;
  sexName?: string;
  dateOfBirthText?: string;
  relationship?: string;
}

export interface MemberAndUserModel extends MemberModel {
  fullName?: string;
  name?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  userName?: string;
  code?: string;
  sexCode?: string;
  nickName?: string;
  dateOfBirth?: Date;

  yearOfBirthText?: number;

  listChild?: MemberModel[];
  listSpouse?: MemberModel[];
  listMemberInFamily?: MemberFamilyModel[];
}

export interface MemberFilterModel extends FilterBaseModel {
  memberId?: string;
  coreUserId?: string;
  parentId?: string;
  spouseId?: string;
  levelItem?: number;
  userInsertId?: string;
  fromMemberId?: string;
  isInternal?: boolean;
  isHideSpouse?: boolean;
  listMemberHide?: string[];
  listMemberId?: string[];

  fullName?: string;
  userName?: string;
}
//#endregion

const MemberService = {
  _featureCode: "member",

  //#region command section
  Add: async function (
    data?: MemberAndUserModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<MemberAndUserModel>("/api/Member/Add", data, {
        cancelToken,
      })
    ).data;
  },

  Update: async function (
    data?: MemberAndUserModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.put<MemberAndUserModel>("/api/Member/Update", data, {
        cancelToken,
      })
    ).data;
  },

  Delete: async function (id?: string, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.delete(`/api/Member/Delete/${id}`, undefined, {
        cancelToken,
      })
    ).data;
  },

  UploadImage: async function (file: any) {
    const formData = new FormData();
    formData.append("file", file);
    return (await ApiHelper.postFile("/api/Member/UploadImage", formData)).data;
  },

  AddRoot: async function (data?: any, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.post<any>("/api/Member/AddRoot", data, {
        cancelToken,
      })
    ).data;
  },
  //#endregion

  //#region query section
  Get: async function (id?: string, cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.get<MemberAndUserModel>(
        `/api/Member/Get/${id}`,
        undefined,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetList: async function (
    filter?: MemberFilterModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.get<MemberAndUserModel[]>(
        `/api/Member/GetList/`,
        filter,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetListTree: async function (
    filter?: MemberFilterModel,
    cancelToken?: CancelTokenModel
  ) {
    return (
      await ApiHelper.post<MemberAndUserModel[]>(
        `/api/Member/GetListTree/`,
        filter,
        {
          cancelToken,
        }
      )
    ).data;
  },

  GetListSelect: async function (
    filter?: MemberFilterModel,
    cancelToken?: CancelTokenModel
  ) {
    const response = await this.GetList(filter, cancelToken);
    const data: SelectDataModel[] = [];
    response.data?.forEach((element) => {
      const yearText = element.yearOfBirthText
        ? ` - ${element.yearOfBirthText}`
        : undefined;
      data.push({
        value: element.memberId!,
        label: `${element.fullName}${yearText ?? ""} - Đời ${
          element.levelItem
        }`,
      });
    });
    return data;
  },

  ExportPdf: async function (filter?: MemberFilterModel) {
    return (
      await ApiHelper.post<string | undefined>("/api/Member/ExportPdf", filter)
    ).data;
  },

  CheckEmptyFamilyTree: async function (cancelToken?: CancelTokenModel) {
    return (
      await ApiHelper.get<boolean>(
        `/api/Member/CheckEmptyFamilyTree`,
        undefined,
        {
          cancelToken,
        }
      )
    ).data;
  },

  //#endregion
};
export default MemberService;
