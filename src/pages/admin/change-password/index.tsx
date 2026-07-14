//#region imports
import { useRouter } from "next/router";
import { useState } from "react";

import { CommonConst } from "@src/Cores/Constants";
import {
  InputTypeEnum,
  NotifyTypeEnum,
  PropertyRuleTypeEnum,
  SizeEnum,
} from "@src/Cores/Enums/CommonEnum";
import { CommonHelper } from "@src/Cores/Helpers";
import { useCommonHelper, useToast, useValidateHelper } from "@src/Cores/Hooks";
import {
  InputChangeModel,
  PropertyModel,
} from "@src/Cores/Models/CommonModels";
import { CoreUserService } from "@src/Cores/Services";
import {
  ChangePasswordModel,
  CoreUserEntity,
} from "@src/Cores/Services/Admin/CoreUserService";
import {
  ButtonTcd,
  ColTcd,
  ContainerMiniTcd,
  ContainerTcd,
  FormGroupInputTcd,
  RowTcd,
} from "@src/Cores/ShareComponents";
//#endregion

export default function ChangePasswordPage() {
  //#region constants
  const useCommonHelperState = useCommonHelper();
  const formId = useCommonHelperState.useGenerateFormId();
  const useToastState = useToast();
  const useValidateHelperState = useValidateHelper();
  const listValidateModelConfig: PropertyModel[] = [
    {
      name: "oldPassword",
      label: "Mật khẩu cũ",
      rules: [
        {
          type: PropertyRuleTypeEnum.requied,
        },
        {
          type: PropertyRuleTypeEnum.password,
        },
        {
          type: PropertyRuleTypeEnum.maxLength,
          value: CommonConst.maxLengthOfPassword,
        },
      ],
    },
    {
      name: "newPassword",
      label: "Mật khẩu mới",
      rules: [
        {
          type: PropertyRuleTypeEnum.requied,
        },
        {
          type: PropertyRuleTypeEnum.password,
        },
        {
          type: PropertyRuleTypeEnum.maxLength,
          value: CommonConst.maxLengthOfPassword,
        },
      ],
    },
    {
      name: "confirmNewPassword",
      label: "Xác nhận mật khẩu mới",
      rules: [
        {
          type: PropertyRuleTypeEnum.requied,
        },
        {
          type: PropertyRuleTypeEnum.password,
        },
        {
          type: PropertyRuleTypeEnum.maxLength,
          value: CommonConst.maxLengthOfPassword,
        },
      ],
    },
  ];
  const listPropertyTrim: string[] = [];

  //#endregion

  //#region state
  const [formData, setFormData] = useState<ChangePasswordModel>({});
  const [formError, setFormError] = useState<ObjectModel>({});
  const [isValidateWhenChange, setIsValidateWhenChange] = useState(false);
  const [loadingData, setLoadingData] = useState<ObjectBooleanModel>({
    save: false,
  });
  const router = useRouter();
  //#endregion

  //#region useEffects
  //#endregion

  //#region functions

  function save() {
    const formDataTemp = { ...formData };
    CommonHelper.trimModel(formDataTemp, listPropertyTrim);

    if (!handleValidateForm(formDataTemp)) return;

    if (formData.newPassword !== formData.confirmNewPassword) {
      setFormError({
        confirmNewPassword: "Xác nhận mật khẩu cần trùng với mật khẩu với",
      });
      return;
    }

    CoreUserService.ChangePassword(formDataTemp)
      .then((res) => {
        if (res.isSuccess) {
          useToastState.showToast(NotifyTypeEnum.success, res.message);
        }
      })
      .finally(() => {
        handle_setLoadingData("save", false);
      });
  }

  function handleValidateInput(propertyName: string, inputValue: any) {
    if (listPropertyTrim.includes(propertyName) && inputValue) {
      inputValue = inputValue.trim();
    }

    const error = useValidateHelperState.validateModelColumn(
      inputValue,
      listValidateModelConfig,
      propertyName
    );
    setFormError((preState) => {
      return { ...preState, [propertyName]: error };
    });
  }

  function handleValidateForm(formDataParam?: CoreUserEntity) {
    formDataParam ??= formData;
    const validationData = useValidateHelperState.validateModel(
      formDataParam,
      listValidateModelConfig,
      formId
    );
    setFormError(validationData.error);
    setIsValidateWhenChange(true);

    return validationData.isValid;
  }

  function handle_setLoadingData(propertyName: string, value?: boolean) {
    setLoadingData((prevState) => {
      return { ...prevState, [propertyName]: value };
    });
  }

  function handle_setFormData(propertyName: string, value?: any) {
    setFormData((prevState) => {
      return { ...prevState, [propertyName]: value };
    });
    if (isValidateWhenChange) {
      handleValidateInput(propertyName, value);
    }
  }
  //#endregion

  //#region mainReturn
  return (
    <ContainerTcd size={SizeEnum.small} isCenter>
      <ContainerMiniTcd title={"Đổi mật khẩu"} isMargin>
        <RowTcd>
          <ColTcd config={CommonConst.configColSmallConainerDefault}>
            <FormGroupInputTcd
              label="Mật khẩu cũ"
              name="oldPassword"
              id={`${formId}oldPassword`}
              isSuggestPassword={false}
              isShowRequired
              inputType={InputTypeEnum.password}
              value={formData.oldPassword}
              error={formError.oldPassword}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("oldPassword", e.value);
              }}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColSmallConainerDefault}>
            <FormGroupInputTcd
              label="Mật khẩu mới"
              name="newPassword"
              id={`${formId}newPassword`}
              isSuggestPassword={false}
              isShowRequired
              inputType={InputTypeEnum.password}
              value={formData.newPassword}
              error={formError.newPassword}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("newPassword", e.value);
              }}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColSmallConainerDefault}>
            <FormGroupInputTcd
              label="Xác nhận mật khẩu mới"
              name="confirmNewPassword"
              id={`${formId}confirmNewPassword`}
              isSuggestPassword={false}
              isShowRequired
              inputType={InputTypeEnum.password}
              value={formData.confirmNewPassword}
              error={formError.confirmNewPassword}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("confirmNewPassword", e.value);
              }}
            />
          </ColTcd>
        </RowTcd>

        <div className="w-full flex flex-row-reverse gap-2 mt-4">
          <ButtonTcd
            text="Lưu lại"
            icon={CommonConst.classIcon.save}
            color={CommonConst.classColor.success}
            isLoading={loadingData.save}
            onClick={save}
          ></ButtonTcd>
          <ButtonTcd
            text="Hủy bỏ"
            icon={CommonConst.classIcon.close}
            color={CommonConst.classColor.danger}
            onClick={() => {
              router.push("/");
            }}
          ></ButtonTcd>
        </div>
      </ContainerMiniTcd>
    </ContainerTcd>
  );
  //#endregion
}
