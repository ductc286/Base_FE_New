import { CSSProperties, ReactNode } from "react";

import { TableColumnTcdModel } from "@src/Cores/ShareComponents/Table/TableCommon";

import {
  DataTypeEnum,
  FormModeEnum,
  PageModeEnum,
  PropertyRuleTypeEnum,
  SearchTypeEnum,
} from "../Enums/CommonEnum";
import { CancelTokenModel } from "../Services/CancelTokenService";

//version 2
export interface FormPropsDataModel<TEntity> {
  formMode: FormModeEnum; //Loại form trong page hiện tại eg: thêm,sửa,xem ds
  stateId?: number; //mã id phân biệt trạng thái thay đổi state giữa các form để update lại dữ liệu phù hợp
  recordId?: string;
  dataExtend?: TEntity; //Dữ liệu riêng khác mà từng form cần truyền(không khuyến nghị)
  ignoreIds?: string[]; //ds id bỏ qua, dùng khi get list
  pathPageListLast?: string;
}
export interface PageContainerState {
  isInitWhenRouterChange?: boolean; //Khi router change, nếu đã xử lý dữ liệu rồi, thì bỏ qua tại effect
  isDataChange?: boolean; //form data có change dữ liệu hay không(logic mới bỏ)
  isInitList?: boolean; //Đã khởi tạo chưa, cho case lúc đầu load form, sau đó back về list
  tabActive?: PageModeEnum; //tab active hiện tại: list/form
  formProps: FormPropsDataModel<unknown>; //props state truyền cho form component
  listProps: FormPropsDataModel<unknown>; //props state truyền cho list component
  pathPageListLast: string; //path page list, khi back lại từ form
}

export interface PageStateModel<T> {
  isLoading?: boolean;
  isFilterChange?: boolean;
  isOpenFilter?: boolean;
  pagination?: PaginationModel;
  listdata?: T[];
  columnConfig: TableColumnTcdModel<T>[];
}

//model state nội tại của form
export interface FormStateModel<T> {
  formMode: FormModeEnum;
  formData: T;
  formDataBackup: T;
  isValidateWhenChange?: boolean;
  isEditAfterAdd?: boolean;
  authorizeAction: AuthorizeActionDefineModel;
  loadingData: ObjectBooleanModel;
  formError: ObjectModel;
}

export interface FormPropsModel<TEntity> {
  formProps: FormPropsDataModel<TEntity>;
  isLoading?: boolean;
  isShowButtonExit?: boolean;
  isSticky?: boolean;

  onExit?: (isDataChange?: boolean) => void;
  onFormModeChange?: (formChange: FormPropsDataModel<TEntity>) => void;
  onDataChange?: () => void;
  onSave?: (data?: TEntity) => void;
  onChangeUrl?: (url: string) => void;
}

//#region request
export interface FilterBaseModel {
  pageSize?: number;
  pageIndex?: number;
  orderBy?: string;
  isDesc?: boolean;
  /**
   * @deprecated
   */
  isRelativeSearch?: boolean;
  searchType?: SearchTypeEnum;

  searchKeyword?: string;
  searchColumn?: string;
  testSort?: {
    a?: string;
    b?: string;
  }[];
  isOpenFilter?: boolean;
}

//#endregion

//#region response
export interface PaginationModel {
  // pageSize: number;
  // pageIndex: number;
  totalRecords: number;
  totalRecordsReturn: number;
  totalPages: number;
}

export interface CustomConfigApiModel {
  cancelToken?: CancelTokenModel;
}

export interface AuthorizeActionDto {
  [key: string]: boolean | undefined;
}

/// <summary>
/// Mô tả các hành động có thể thực hiện trên một đối tượng, ví dụ như thêm, sửa, xóa, xem, v.v.
export interface AuthorizeActionDefineModel {
  add?: boolean;
  view?: boolean;
  edit?: boolean;
  delete?: boolean;
  resetPasswordOtherUser?: boolean;
  changePassword?: boolean;

  requestApproval?: boolean;
  cancelRequestApproval?: boolean;
  approve?: boolean;
  cancelApprove?: boolean;
  publish?: boolean;
  cancelPublish?: boolean;
  cancel?: boolean;
  reject?: boolean;
}

export interface AuthorizeModel {
  authorizeAction?: AuthorizeActionDto;
  disableAction?: AuthorizeActionDto;
}
export interface ResponseBaseModel<TEntity> {
  data?: TEntity;
  isSuccess: boolean;
  message?: string;
  code?: string;
  statusCode?: CodeResponseEnum;
  actionCode?: string;
  actionId?: string;
  clientRequestId?: string;
  authorizeActionInfo?: AuthorizeModel;
  totalRecords?: number;

  authorize?: AuthorizeModel;
  pagination?: PaginationModel;
  listAllIds?: string[];
}

export enum CodeResponseEnum {
  //[Description("Thành công")]
  Success = 0,

  //[Description("Có lỗi xảy ra")]
  ErrorGeneral = 1,

  //[Description("Dữ liệu không hợp lệ")]
  ErrorInvalidData = 2,

  //[Description("Lỗi cơ sở dữ liệu")]
  ErrorDatabase = 3,

  //[Description("Không tìm thấy bản ghi")]
  NotFound = 4,

  //[Description("Không có quyền truy cập")]
  Unauthorized = 5,

  //[Description("Không có quyền truy cập")]
  CancellationToken = 6,
}
//#endregion

export interface BaseModel {
  userInsert?: string;
  userUpdate?: string;

  userInsertId?: string;
  insertTime?: Date;
  userUpdateId?: string;
  updateTime?: Date;
}

export interface BaseNomalModel {}

export interface PropertyModel {
  name: string;
  type?: DataTypeEnum;
  valueDefault?: string | number | boolean | Date | string[];
  valueText?: string;

  //for validate
  label?: string;
  rules?: PropertyRuleModel[];
}

export interface PropertyRuleModel {
  type: PropertyRuleTypeEnum;
  value?: any;
  customErrorMessage?: string;
}

/**
 * model khi input change, value là dữ liệu sau khi thay đổi, event là model của input khi change trong js, eg about: target, value, preventDefault,...
 */
export interface InputChangeModel {
  value?: any;
  checked?: boolean;
  event?: any;
}

export interface ListItemModel {
  id?: string; //cần có để xác định key
  label?: string;
  icon?: string;
  className?: string;
  style?: CSSProperties;
  isSelected?: boolean;
  url?: string;
  listUrlActive?: (string | undefined)[]; //khi chứa url này sẽ css active; có thể gồm url của nó và các con của nó
  isSeparator?: boolean;
  isHide?: boolean;

  render?: ReactNode;
  items?: ListItemModel[];

  onclick?: (event?: any) => void;
}

export interface ChangeStatusModel {
  recordId?: string;
  note?: string;
}

export interface AuthorizeActionModel {
  coreFeatureCode?: string;
  coreActionCode?: string;
  coreFunctionCode?: string;
  recordId?: string;
}
