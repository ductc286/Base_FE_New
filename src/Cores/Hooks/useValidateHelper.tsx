import {
  NotifyTypeEnum,
  PropertyRuleTypeEnum,
} from "@src/Cores/Enums/CommonEnum";
import { CommonHelper, DateTimeHelper } from "@src/Cores/Helpers";
import { ConfirmModel } from "@src/Cores/Helpers/ConfirmHelper";
import useToast from "@src/Cores/Hooks/useToast";
import { PropertyModel } from "@src/Cores/Models/CommonModels";

export default function useValidateHelper() {
  const useToastState = useToast();

  /**
   * validate all column in model, thường dùng khi save form
   */
  function validateModel<TEntity>(
    data: TEntity,
    listPropertyModel: PropertyModel[],
    formIdFocusError?: string
  ): { isValid: boolean; error: ObjectModel } {
    let isValid: boolean = true;
    const error: ObjectModel = {};
    let isFocused: boolean = false; //focus input đầu tiên bị lỗi

    listPropertyModel.forEach((propertyModel) => {
      const dynamicKey = propertyModel.name as keyof TEntity;
      const value = data[dynamicKey] as any;
      const errorTemp = getValidateRule(value, propertyModel);
      if (errorTemp) {
        isValid = false;
        error[propertyModel.name] = errorTemp;
        if (formIdFocusError && !isFocused) {
          document
            .getElementById(`${formIdFocusError}${propertyModel.name}`)
            ?.focus();
          isFocused = true;
        }
      }
    });

    if (!isValid) {
      useToastState.showToast(
        NotifyTypeEnum.warning,
        "Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại"
      );
    }

    return {
      isValid,
      error,
    };
  }

  /**
   * validate một cột trong model, thường dùng cho sự kiện onchane 1 input
   */
  function validateModelColumn<TEntity>(
    value: any,
    listPropertyModel: PropertyModel[],
    columnName: string
  ): string | undefined {
    const propertyModel = listPropertyModel.find((x) => x.name === columnName);
    if (propertyModel) {
      return getValidateRule(value, propertyModel);
    }
    return undefined;
  }

  return { validateModel, validateModelColumn };
}

//#region private functions
function getValidateRule(
  value: any,
  propertyModel: PropertyModel
): string | undefined {
  let error = "";

  const isHaveValue = !CommonHelper.isNullOrEmpty(value);

  if (!propertyModel?.rules) {
    return error;
  }

  for (let rule of propertyModel.rules) {
    if (!isHaveValue && rule.type === PropertyRuleTypeEnum.requied) {
      error = `${propertyModel.label} không được để trống`;
      break;
    }
    if (!isHaveValue) {
      continue;
    }
    switch (rule.type) {
      case PropertyRuleTypeEnum.minLength:
        if (value.length < rule.value) {
          error = `${propertyModel.label} cần tối thiểu ${rule.value} ký tự`;
        }
        break;

      case PropertyRuleTypeEnum.maxLength:
        if (value.length > rule.value) {
          error = `${propertyModel.label} có tối đa ${rule.value} ký tự`;
        }
        break;

      case PropertyRuleTypeEnum.minValue:
        if (isHaveValue && value < rule.value) {
          error = `${propertyModel.label} cần lớn hơn ${rule.value}`;
        }
        break;

      case PropertyRuleTypeEnum.maxValue:
        if (isHaveValue && value > rule.value) {
          error = `${propertyModel.label} cần nhỏ hơn ${rule.value}`;
        }
        break;

      //todo cần xem lại logic check
      case PropertyRuleTypeEnum.dateValid:
        if (value < rule.value) {
          error = `${
            propertyModel.label
          } cần lớn hơn ${DateTimeHelper.getDateString(new Date(1753, 1, 1))}`;
        }
        break;

      case PropertyRuleTypeEnum.password:
        const regex = /\s/g;
        if (regex.test(value)) {
          error = `${propertyModel.label} chứa ký tự không hợp lệ`;
        }
        break;

      default:
        break;
    }

    if (error) {
      break;
    }
  }
  return error;
}
//#endregion
