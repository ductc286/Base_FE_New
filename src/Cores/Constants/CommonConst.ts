import { DataTypeEnum, SearchTypeEnum } from "@src/Cores/Enums/CommonEnum";
import { PaginationModel, PropertyModel } from "@src/Cores/Models/CommonModels";
import { IColConfig } from "@src/Cores/ShareComponents/ColTcd";

//#region data defaults
const configColDefault: IColConfig = {
  xs: { size: 12 },
  sm: { size: 6 },
  md: { size: 4 },
  xl: { size: 3 },
};

const configColHorizontalDefault: IColConfig = {
  xs: { size: 12 },
  sm: { size: 6 },
  md: { size: 6 },
  xl: { size: 4 },
};

const configColSmallConainerDefault: IColConfig = {
  xs: { size: 12 },
};

const paginationDefault: PaginationModel = {
  // pageIndex: 1,
  // pageSize: 20,
  totalPages: 0,
  totalRecords: 0,
  totalRecordsReturn: 0,
};

const filterPropertiesDefault: PropertyModel[] = [
  { name: "pageIndex", type: DataTypeEnum.number, valueDefault: 1 },
  {
    name: "pageSize",
    type: DataTypeEnum.number,
    valueDefault: 20,
  },
  {
    name: "searchType",
    type: DataTypeEnum.number,
    valueDefault: SearchTypeEnum.contains,
  },
  { name: "searchKeyword", type: DataTypeEnum.string },
  { name: "orderBy", type: DataTypeEnum.string },
  { name: "isDesc", type: DataTypeEnum.boolean },
  { name: "isOpenFilter", type: DataTypeEnum.boolean, valueDefault: false },
];
//#endregion

const CommonConst = {
  css: {
    cssMapper: "cssMapper",
    tableStriped: "tableStriped",
  },
  form: {
    formLayout: {
      horizontal: "horizontal",
      vertical: "vertical",
    },
    status: {
      normal: "normal",
      error: "error",
    },
    validate: {
      requied: "requied",
      minLength: "minLength",
      maxLength: "maxLength",
      minValue: "minValue",
      maxValue: "maxValue",
      minDate: "minDate",
      maxDate: "maxDate",
    },
    formMode: {
      add: "add",
      edit: "edit",
      detail: "detail",
      default: "default",
      unknown: "unknown",
    },
    size: {
      small: "small",
      default: "default",
      large: "large",
    },
    inputType: {
      text: "text",
      number: "number",
      dateTime: "dateTime",
      select: "select",
      password: "password",
      checkbox: "checkbox",
      textarea: "textarea",
      dateText: "dateText",
    },
  },
  modalPopupMode: {
    okCancel: "okCancel",
    warning: "warning",
    error: "error",
    success: "success",
    ok: "ok",
  },
  table: {
    classThemeDefault: "ag-theme-alpine",
    heightDefault: "600px",

    rowSelection: {
      multiple: "multiple",
    },
    pageSizeDefault: 20,
    pageSizeAll: -1,
  },
  title: {
    viewDetail: "Xem chi tiết",
  },
  url: {
    home: "/",
    login: "/login",
    page401: "/other/401",
    page404: "/other/404",
  },
  classIcon: {
    edit: "far fa-edit",
    delete: "far fa-trash-alt",
    add: "fas fa-plus",
    view: "fas fa-eye",
    view2: "far fa-eye",
    unView2: "far fa-eye-slash",
    search: "fas fa-search",
    save: "far fa-save",
    close: "fa-solid fa-xmark",
    copy: "far fa-copy",
    warning: "fas fa-exclamation-triangle",
    check: "fas fa-check",
    refresh: "fas fa-sync-alt",
    reset: "fas fa-redo-alt",
    list: "far fa-list-alt",
    key: "fas fa-key",
    filter: "fas fa-filter",
    filterXmark: "fa-solid fa-filter-circle-xmark",
    calendar: "far fa-calendar",
    login: "fa-solid fa-arrow-right-to-bracket",
    cardZoomOut: "fas fa-chevron-up",
    cardZoomIn: "fas fa-chevron-down",
    ellipsisHorizontal: "fas fa-ellipsis-h",
    ellipsisVertical: "fas fa-ellipsis-v",
    upload: "fas fa-upload",
    print: "fas fa-print",
    util: "fas fa-th-large",
    info: "fas fa-info-circle",
    filePdf: "far fa-file-pdf",
    tool: "fas fa-tools",
    zoomIn: "fas fa-search-plus",
    zoomOut: "fas fa-search-minus",
    up: "fas fa-chevron-circle-up",
    setting: "fa-solid fa-gear",
    unCheck: "fa-regular fa-square",
    checked: "fa-regular fa-square-check",
  },
  classColor: {
    primary: "primary",
    success: "success",
    danger: "danger",
    info: "info",
    warning: "warning",
    secondary: "secondary",
  },
  color: {
    editIcon: "#30b1ff",
    deleteIcon: "#ff4719",
    warning: "#f4c22b",
    viewDetailIcon: "#30b1ff",
    // viewDetailIcon : "#099d09",
    black: "rgb(74 73 73)",
  },
  tabActive: {
    default: "default",
    form: "form",
  },
  general: {
    replaceWhenChangeFormMode: false,
    defaultWithModal: 1200,
    spaceHtml: "&nbsp;",
  },
  pageStatus: {
    ok: "ok",
    loading: "loading",
    page404: "404",
    page401: "401",
    notData: "notData",
  },

  buttonType: {
    icon: "icon",
    button: "button",
  },
  appCode: {
    sexCode: "sexCode",
  },
  className: {
    cssMaper: "mapper-tcd",
    toolbarItem: "tcd-toolbar-item",
    inputInvalid: "p-invalid",
  },
  buttonMode: {
    default: "default",
    text: "text",
  },
  configColDefault,
  configColHorizontalDefault,
  configColSmallConainerDefault,
  size: {
    small: "small",
    default: "default",
    large: "large",
  },
  paginationDefault,
  maxLengthOfName: 255,
  maxLengthOfCode: 100,
  maxLengthOfPassword: 30,
  editorConfig: {
    buttons:
      "bold,underline,italic,strikethrough,|,outdent,indent,font,fontsize,brush,paragraph,align,hr,|,fullsize",
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
  },
  isOffUrlParam: false,
  pageSizeDefault: 20,
  filterPropertiesDefault,
  keyDisableItemInTable: "_isDisableCheck",
  heightTopFixed: 0,
  heightTitleSticky: 43,
  date: {
    dateFormatDefault: "dd/MM/yyyy",
  },
};

export default CommonConst;
