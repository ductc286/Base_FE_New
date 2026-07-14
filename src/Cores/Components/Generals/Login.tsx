import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { CommonConst } from "@src/Cores/Constants";
import {
  InputTypeEnum,
  PropertyRuleTypeEnum,
  SizeEnum,
} from "@src/Cores/Enums/CommonEnum";
import { CommonHelper } from "@src/Cores/Helpers";
import { useCommonHelper, useValidateHelper } from "@src/Cores/Hooks";
import { PropertyModel } from "@src/Cores/Models/CommonModels";
import { AppAuthenticationService } from "@src/Cores/Services";
import {
  ButtonTcd,
  ColTcd,
  ContainerMiniTcd,
  ContainerTcd,
  FormGroupInputTcd,
  RowTcd,
  ToolbarTcd,
} from "@src/Cores/ShareComponents";

export default function Login() {
  //#region constants
  const formId = useCommonHelper().useGenerateFormId();
  const router = useRouter();
  const useValidateHelperState = useValidateHelper();
  const configValidateModel: PropertyModel[] = [
    {
      name: "userName",
      label: "Tài khoản",
      rules: [
        {
          type: PropertyRuleTypeEnum.requied,
        },
        {
          type: PropertyRuleTypeEnum.maxLength,
          value: CommonConst.maxLengthOfCode,
        },
      ],
    },
    {
      name: "password",
      label: "Mật khẩu",
      rules: [
        {
          type: PropertyRuleTypeEnum.requied,
        },
        {
          type: PropertyRuleTypeEnum.maxLength,
          value: 30,
        },
      ],
    },
  ];
  //#endregion

  const [formData, setFormData] = useState<ObjectModel>({});
  const [formMessage, set_formMessage] = useState<ObjectModel>({});
  const [isValidateWhenChange, setIsValidateWhenChange] = useState(false);
  const [redirectUrl, set_redirectUrl] = useState<string>();
  const [isRedirect, set_isRedirect] = useState(false);

  useEffect(() => {
    if (!isRedirect && redirectUrl) {
      set_isRedirect(true);
      router.push(redirectUrl);
    }
  }, [isRedirect, redirectUrl, router]);

  const fun_login = () => {
    if (!fun_validateForm()) return;
    AppAuthenticationService.signIn(formData).then((res) => {
      if (res.isSuccess) {
        localStorage.setItem("tokenInfo", JSON.stringify(res.data?.token));
        localStorage.setItem(
          "authorizeInfo",
          JSON.stringify(res.data?.authorizeInfo)
        );
        const redirect = router.query.redirect as string;
        const redirectDecode = CommonHelper.isNullOrEmpty(redirect)
          ? "/"
          : decodeURIComponent(redirect);
        set_redirectUrl(redirectDecode);
      }
    });
  };

  const fun_validateInput = (propertyName: string, inputValue: any) => {
    if (!isValidateWhenChange) {
      return;
    }

    const error = useValidateHelperState.validateModelColumn(
      inputValue,
      configValidateModel,
      propertyName
    );
    set_formMessage((preState) => {
      return { ...preState, [propertyName]: error };
    });
  };

  const fun_validateForm = () => {
    const validationData = useValidateHelperState.validateModel(
      formData,
      configValidateModel,
      formId
    );
    set_formMessage(validationData.error);
    setIsValidateWhenChange(true);

    return validationData.isValid;
  };

  return (
    <div className="divContainerFull bgFull">
      <ContainerTcd size={SizeEnum.small} isCenter>
        <ContainerMiniTcd title={"Đăng nhập"} isAutocompleteForm={true}>
          <RowTcd>
            <ColTcd>
              <FormGroupInputTcd
                label="Tài khoản"
                name="userName"
                id={`${formId}userName`}
                autoComplete="username"
                isShowRequired
                value={formData.userName}
                error={formMessage.userName}
                inputType={InputTypeEnum.text}
                onChange={(e) => {
                  setFormData({ ...formData, userName: e.value });
                  fun_validateInput("userName", e.value);
                }}
              />
            </ColTcd>
            <ColTcd>
              <FormGroupInputTcd
                label="Mật khẩu"
                name="password"
                isShowRequired
                id={`${formId}password`}
                autoComplete="current-password"
                isShowToggleView={false}
                inputType={InputTypeEnum.password}
                value={formData.password}
                error={formMessage.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.value });
                  fun_validateInput("password", e.value);
                }}
              />
            </ColTcd>
          </RowTcd>
          <ToolbarTcd.ContainerCenter>
            <ButtonTcd
              text="Đăng nhập"
              color={CommonConst.classColor.success}
              icon={CommonConst.classIcon.login}
              onClick={fun_login}
            ></ButtonTcd>
          </ToolbarTcd.ContainerCenter>
          <Link href={"/"}>Trang chủ</Link>
        </ContainerMiniTcd>
      </ContainerTcd>
    </div>
  );
}
