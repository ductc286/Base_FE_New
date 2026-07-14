//#region imports
import { useEffect, useState } from "react";

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
  FormPropsModel,
  InputChangeModel,
  PropertyModel,
} from "@src/Cores/Models/CommonModels";
import { CoreUserService } from "@src/Cores/Services";
import { ResetPasswordModalModel } from "@src/Cores/Services/Admin/CoreUserService";
import {
  ButtonTcd,
  ColTcd,
  ContainerMiniTcd,
  FormGroupInputTcd,
  ModalTcd,
  RowTcd,
} from "@src/Cores/ShareComponents";

//#endregion

export interface ResetPasswordModalCpnModel {
  coreUserId?: string;
  userName?: string;
  fullName?: string;
}

export function ResetPasswordModalCpn(
  props: Readonly<FormPropsModel<ResetPasswordModalCpnModel>>
) {
  //#region constants
  const useCommonHelperState = useCommonHelper();
  const formId = useCommonHelperState.useGenerateFormId();
  const useToastState = useToast();
  const useValidateHelperState = useValidateHelper();
  const listValidateModelConfig: PropertyModel[] = [
    {
      name: "newPassword",
      label: "Mật khẩu mới",
      rules: [
        {
          type: PropertyRuleTypeEnum.password,
        },
        {
          type: PropertyRuleTypeEnum.requied,
        },
        {
          type: PropertyRuleTypeEnum.minLength,
          value: 4,
        },
        {
          type: PropertyRuleTypeEnum.maxLength,
          value: 30,
        },
      ],
    },
  ];
  const listPropertyTrim: string[] = [];
  //#endregion

  //#region state
  const [formData, setFormData] = useState<ResetPasswordModalModel>({});
  const [formError, setFormError] = useState<ObjectModel>({});
  const [isValidateWhenChange, setIsValidateWhenChange] = useState(false);

  const [loadingData, setLoadingData] = useState<ObjectBooleanModel>({
    form: false,
  });
  const [isOpen, setIsOpen] = useState(false);
  //#endregion

  //#region useEffects
  useEffect(() => {
    if (props.formProps.stateId) {
      setIsOpen(true);
      loadData({
        coreUserId: props.formProps.dataExtend?.coreUserId,
      });
    }
  }, [props.formProps.stateId]);
  //#endregion

  //#region functions

  function loadData(formDataParam: ResetPasswordModalModel) {
    setFormData(formDataParam);
    setIsValidateWhenChange(false);
    setFormError({});
  }

  function handle_setLoadingData(propertyName: string, value?: boolean) {
    setLoadingData((prevState) => {
      return { ...prevState, [propertyName]: value };
    });
  }

  function save() {
    const formDataTemp = CommonHelper.cloneObject(formData);
    CommonHelper.trimModel(formDataTemp, listPropertyTrim);
    if (!handleValidateForm(formDataTemp)) return;

    handle_setLoadingData("save", true);

    CoreUserService.ResetPasswordOtherUser(formDataTemp)
      .then((res) => {
        if (res.isSuccess) {
          useToastState.showToast(NotifyTypeEnum.success, res.message);
          setIsOpen(false);
        }
      })
      .finally(() => {
        handle_setLoadingData("save", false);
      });
  }

  function handleValidateInput(propertyName: string, inputValue?: any) {
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

  function handleValidateForm(formDataParam?: ResetPasswordModalModel) {
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
    <ModalTcd
      isOpen={isOpen}
      size={SizeEnum.small}
      onExit={() => setIsOpen(false)}
    >
      <ContainerMiniTcd
        title={"Đổi mật khẩu"}
        isShowIconClose={true}
        onClose={() => setIsOpen(false)}
      >
        <RowTcd>
          <ColTcd config={CommonConst.configColSmallConainerDefault}>
            <FormGroupInputTcd
              label="Tài khoản"
              name="userName"
              inputType={InputTypeEnum.text}
              id={`${formId}userName`}
              value={props.formProps.dataExtend?.userName}
              readOnly={true}
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
            onClick={() => setIsOpen(false)}
          ></ButtonTcd>
        </div>
      </ContainerMiniTcd>
    </ModalTcd>
  );
  //#endregion
}
