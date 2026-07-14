import GlobalConfig from "@src/AppForders/Configs/GlobalConfig";

import CommonConst from "../Constants/CommonConst";
import { DataTypeEnum, FormModeEnum, SizeEnum } from "../Enums/CommonEnum";
import { PropertyModel } from "../Models/CommonModels";
import DateTimeHelper from "./DateTimeHelper";

//#region share functions
function isNull(data: any) {
  if (data === undefined || data === null) {
    return true;
  }
  return false;
}
function getFormModeFromUrl(pathname: string, prefixPath: any) {
  if (pathname.match(`^${prefixPath}/add`)) {
    return CommonConst.form.formMode.add;
  }
  if (pathname.match(`^${prefixPath}/edit`)) {
    return CommonConst.form.formMode.edit;
  }
  if (pathname.match(`^${prefixPath}/detail`)) {
    return CommonConst.form.formMode.detail;
  }
  return CommonConst.form.formMode.default;
}

function getFormModeFromUrlOk(
  pathname: string,
  prefixPath: string
): FormModeEnum {
  if (pathname.match(`^${prefixPath}/add`)) {
    return FormModeEnum.add;
  }
  if (pathname.match(`^${prefixPath}/edit`)) {
    return FormModeEnum.edit;
  }
  if (pathname.match(`^${prefixPath}/detail`)) {
    return FormModeEnum.detail;
  }
  if (pathname.match(`^${prefixPath}$`)) {
    return FormModeEnum.list;
  }
  return FormModeEnum.unknown;
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
//#endregion

const CommonHelper = {
  getPropertyValueByName: function (objectData: any, propertyName: string) {
    return objectData[propertyName];
  },

  //#region object
  isNull(data: any) {
    return isNull(data);
  },
  isNullOrEmpty(data: any) {
    if (data === undefined || data === null || data === "") {
      return true;
    }
    if (Array.isArray(data) && data.length === 0) {
      return true;
    }
    return false;
  },
  compareAllType(value1: any, value2: any) {
    if (isNull(value1)) return -1;
    if (isNull(value2)) return 1;
    if (typeof value1 === "boolean" || typeof value2 === "boolean") {
      const value1Temp = !isNull(value1) ? value1 : false;
      const value2Temp = !isNull(value2) ? value2 : false;
      return value1Temp - value2Temp;
    } else if (typeof value1 === typeof Number) {
      return value1 - value2;
    } else {
      return value1.localeCompare(value2);
    }
  },
  cloneObject<TEntity>(data: TEntity) {
    //return Object.assign({}, data);
    // if (!data) {
    //   return undefined;
    // }
    return JSON.parse(JSON.stringify(data)) as TEntity;
  },
  cloneList<TEntity>(listData: TEntity) {
    // return Object.assign([], listData);
    // if (!listData) {
    //   return undefined;
    // }
    return JSON.parse(JSON.stringify(listData)) as TEntity;
  },
  //#endregion

  //#region Other
  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  getConcatClass(value1: string, value2: string) {
    if (isNull(value1)) return value2;
    if (isNull(value2)) return value1;
    return value1 + " " + value2;
  },
  generateGuid() {
    // return uuidv4();
  },

  generateFormActionCode() {
    return getRandomInt(1000, 9999);
  },

  //Tạo id ngẫu nhiên cho form state để form child nhận biết và xử lý form change
  generateFormStateId() {
    return getRandomInt(1000, 9999);
  },

  getUrlForm(url: any, id: any) {
    return `${url}/${id}`;
  },

  getTabActiveFromUrl(pathname: any, prefixPath: any) {
    const formMode = getFormModeFromUrl(pathname, prefixPath);
    const ret =
      formMode === CommonConst.form.formMode.default
        ? CommonConst.tabActive.default
        : CommonConst.tabActive.form;
    return ret;
  },
  getFormModeFromUrl(pathname: string, prefixPath: any) {
    return getFormModeFromUrl(pathname, prefixPath);
  },

  getFormModeFromUrlOk: getFormModeFromUrlOk,

  getIdFromUrl(props: any) {
    return props.router.query.id;
  },
  add3Dots(string: string, limit: number) {
    if (string.length > limit) {
      // you can also use substr instead of substring
      string = string.substring(0, limit) + "...";
    }
    return string;
  },
  getAbsolutePath(url?: string) {
    if (!url) {
      return url;
    }
    const regex = RegExp(`^http`, "g");
    if (!regex.test(url)) {
      url = GlobalConfig.BASE_URL_FILE_BASE + url;
    }
    return url;
  },

  concatString(
    string1: string,
    string2: string,
    string3: string | undefined = undefined
  ) {
    return [string1, string2, string3].join("");
  },

  concatClassNames(
    ...args: Array<string | boolean | null | undefined>
  ): string {
    return args.filter((item) => !!item).join(" ");
  },

  //Convert từ danh sách property vào model giá trị tương ứng
  getModelValue: function <TEntity>(
    properties: PropertyModel[],
    filterParam?: TEntity
  ): TEntity {
    filterParam ??= {} as TEntity;
    properties.forEach((property) => {
      const dynamicKey = property.name as keyof TEntity;
      const value = this.getPropertyValue(property);
      if (!this.isNullOrEmpty(value)) {
        filterParam![dynamicKey] = value;
      }
    });
    return filterParam;
  },

  //Lấy value từ property model
  getPropertyValue: function (propertyModel: PropertyModel): any {
    switch (propertyModel.type) {
      case DataTypeEnum.number:
        return propertyModel.valueText
          ? Number(propertyModel.valueText)
          : propertyModel.valueDefault;
      case DataTypeEnum.boolean:
        return propertyModel.valueText
          ? propertyModel.valueText === "true"
          : propertyModel.valueDefault;
      case DataTypeEnum.date:
        return propertyModel.valueText
          ? DateTimeHelper.parseDateTime(propertyModel.valueText)
          : DateTimeHelper.parseDateTime(propertyModel.valueDefault);
      case DataTypeEnum.arrayString:
        return propertyModel.valueText
          ? propertyModel.valueText.split(",")
          : propertyModel.valueDefault;
      default:
        return propertyModel.valueText ?? propertyModel.valueDefault;
    }
  },

  //kiểm tra xem filter extend có thay đổi gì không: có giá trị và giá trị đó khác default
  isFilterExtendChange: function (
    filterParam: any,
    filterExtendColumns: PropertyModel[]
  ): boolean {
    return filterExtendColumns.some(
      (x) =>
        !this.isNullOrEmpty(filterParam[x.name]) &&
        filterParam[x.name] !== x.valueDefault
    );
  },

  /**
   * trim sapce model các column được truyền vào
   */
  trimModel: function <TEntity>(data: TEntity, columnTrims: string[]) {
    if (!data) {
      return data;
    }
    const dataParam = data;
    columnTrims.forEach((column) => {
      const dynamicKey = column as keyof TEntity;
      if (this.getDataType(dataParam[dynamicKey]) === DataTypeEnum.string) {
        dataParam[dynamicKey] = dataParam[dynamicKey]?.toString().trim() as any;
      }
    });
  },

  getDataType: function (data: any): DataTypeEnum {
    if (this.isNull(data)) {
      return DataTypeEnum.undefined;
    }
    if (typeof data === "string") {
      return DataTypeEnum.string;
    }
    if (typeof data === "number") {
      return DataTypeEnum.string;
    }
    if (typeof data === "boolean") {
      return DataTypeEnum.string;
    }
    if (data.getMonth) {
      return DataTypeEnum.date;
    }
    if (Array.isArray(data)) {
      return DataTypeEnum.array;
    }
    return DataTypeEnum.undefined;
  },

  getSizeClassName: function (size?: SizeEnum): string | undefined {
    if (size === SizeEnum.small) {
      return "size-sm-tcd";
    }
    if (size === SizeEnum.medium) {
      return "size-md-tcd";
    }
    if (size === SizeEnum.large) {
      return "size-lg-tcd";
    }
    return undefined;
  },

  trySetValue: function <TEntity>(
    dataModel: TEntity,
    propertyName?: string,
    value?: any
  ) {
    if (propertyName) {
      const dynamicKey = propertyName as keyof TEntity;
      dataModel[dynamicKey] = value;
    }
  },

  encodeURIComponent: function (url?: string) {
    return encodeURIComponent(url ?? "");
  },

  decodeURIComponent: function (url?: string) {
    return decodeURIComponent(url ?? "");
  },
  //#endregion
};
export default CommonHelper;
