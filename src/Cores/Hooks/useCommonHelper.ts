import { useRouter } from "next/router";
import { useId } from "react";

import { FormModeEnum, PageModeEnum } from "../Enums/CommonEnum";
import CommonHelper from "../Helpers/CommonHelper";
import { PropertyModel } from "../Models/CommonModels";

//#region private functions
function toUrlParamValue(dataValue: any): string {
  if (CommonHelper.isNullOrEmpty(dataValue)) {
    return "";
  }
  const typeTemp = typeof dataValue;
  if (Array.isArray(dataValue)) {
    const arr = dataValue as string[];
    return arr.join(",");
  }
  if (typeTemp === typeof Date) {
    //todo
    return String(dataValue);
  }
  return String(dataValue);
}
//#endregion

const useCommonHelper = () => {
  const router = useRouter();

  //Lấy url bao gồm path và tham số query
  function getUrlByFilter<TEntity>(
    filterPropertiesParams: PropertyModel[],
    filter?: TEntity
  ): string {
    const pathName = router.pathname;
    //truy vấn url hiện tại

    const queryParams = { ...router.query };
    const filterProperties = CommonHelper.cloneList(filterPropertiesParams);

    //thêm params vào url hiện tại
    if (filter && filterProperties) {
      filterProperties.forEach((property) => {
        const dynamicKey = property.name as keyof TEntity;
        const valueTemp = filter[dynamicKey];
        if (property.valueDefault === valueTemp) {
          queryParams[property.name] = "";
        } else {
          queryParams[property.name] = toUrlParamValue(valueTemp);
        }
      });
    }

    const queryParamsTemp = Object.entries(queryParams) as [string, string][];

    //Loại bỏ những tham số không có giá trị
    const queryParamsArray = queryParamsTemp.filter(
      (x) => !CommonHelper.isNullOrEmpty(x[1])
    );

    //Sắp xếp params trên url theo thứ tự alpha
    queryParamsArray.sort((a, b) => {
      return CommonHelper.compareAllType(a[0], b[0]);
    });
    let res = "";
    queryParamsArray.forEach((value, i) => {
      if (value[1]) {
        res +=
          i === 0 ? `?${value[0]}=${value[1]}` : `&${value[0]}=${value[1]}`;
      }
    });
    return pathName + res;
  }

  function getUrlByQuery<TEntity>(queryParams: [string, string][]): string {
    const queryParamsRouter = { ...router.query };
    queryParams.forEach((element) => {
      queryParamsRouter[element[0]] = element[1];
    });

    const queryParamsTemp = Object.entries(queryParamsRouter) as [
      string,
      string,
    ][];

    const queryParamsArray = queryParamsTemp.filter(
      (x) => !CommonHelper.isNullOrEmpty(x[1])
    );

    //Sắp xếp params trên url theo thứ tự alpha
    queryParamsArray.sort((a, b) => {
      return CommonHelper.compareAllType(a[0], b[0]);
    });

    let res = "";
    queryParamsArray.forEach((value, i) => {
      if (value[1]) {
        res +=
          i === 0 ? `?${value[0]}=${value[1]}` : `&${value[0]}=${value[1]}`;
      }
    });
    return router.pathname + res;
  }

  function getQueryByModel<TEntity>(
    propertiesParams: PropertyModel[],
    modelData?: TEntity
  ): [string, string][] {
    const queryParamsTemp: [string, string][] = [];
    if (modelData && propertiesParams) {
      propertiesParams.forEach((property) => {
        const dynamicKey = property.name as keyof TEntity;
        const valueTemp = modelData[dynamicKey];
        if (property.valueDefault === valueTemp) {
          queryParamsTemp.push([property.name, ""]);
        } else {
          queryParamsTemp.push([property.name, toUrlParamValue(valueTemp)]);
        }
      });
    }

    return queryParamsTemp;
  }

  function getFilterByUrl<TEntity>(filterProperties: PropertyModel[]): TEntity {
    const queryParamsTemp = Object.entries(router.query) as [string, string][];

    const propertiesHaveValue: PropertyModel[] =
      CommonHelper.cloneList(filterProperties);

    propertiesHaveValue &&
      queryParamsTemp.forEach((queryValue) => {
        const foundProperty = propertiesHaveValue.find(
          (x) => x.name === queryValue[0]
        );
        if (foundProperty) {
          foundProperty.valueText = queryValue[1];
          foundProperty.valueDefault = undefined;
        }
      });

    const result = CommonHelper.getModelValue<TEntity>(propertiesHaveValue);
    return result;
  }

  function getFormMode(prefixPath: string): FormModeEnum {
    const pathname = router.pathname;

    if (RegExp(`^${prefixPath}/add`, "g").test(pathname)) {
      return FormModeEnum.add;
    }

    if (RegExp(`^${prefixPath}/edit`, "g").test(pathname)) {
      return FormModeEnum.edit;
    }

    if (RegExp(`^${prefixPath}/detial`, "g").test(pathname)) {
      return FormModeEnum.detail;
    }

    if (RegExp(`^${prefixPath}/`, "g").test(pathname)) {
      return FormModeEnum.detail;
    }

    return FormModeEnum.notFound;
  }

  function getPageMode(prefixPath: string): PageModeEnum {
    const pathname = router.pathname;

    if (
      RegExp(`^${prefixPath}/add`, "g").test(pathname) ||
      RegExp(`^${prefixPath}/edit`, "g").test(pathname) ||
      RegExp(`^${prefixPath}/detail`, "g").test(pathname)
    ) {
      return PageModeEnum.form;
    }

    if (RegExp(`^${prefixPath}`, "g").test(pathname)) {
      return PageModeEnum.list;
    }

    return PageModeEnum.notFound;
  }

  /**
   * Tạo mã id cho form, làm prefix id cho input trong form, là giống nhau cho client và server
   */
  function useGenerateFormId(): string {
    const res = useId() + useId() + useId();
    const regex = new RegExp("[^a-zA-Z0-9]", "g");
    const result = "id" + res.replace(regex, "");
    return result;
  }

  return {
    getUrlByFilter,
    getFilterByUrl,
    getPageMode,
    getFormMode,
    useGenerateFormId,

    getQueryByModel,
    getUrlByQuery,
  };
};

export default useCommonHelper;
