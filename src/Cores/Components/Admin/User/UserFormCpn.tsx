//#region imports
import { useEffect, useRef, useState } from "react";

import { MemberAndUserModel } from "@src/AppForders/Services/MemberService";
import OtherInfoForFormCpn from "@src/Cores/Components/ShareComponents/OtherInfoForFormCpn";
import {
  ResetPasswordModalCpn,
  ResetPasswordModalCpnModel,
} from "@src/Cores/Components/ShareComponents/ResetPasswordModalCpn";
import { CommonConst } from "@src/Cores/Constants";
import {
  FormModeEnum,
  InputTypeEnum,
  NotifyTypeEnum,
  PropertyRuleTypeEnum,
} from "@src/Cores/Enums/CommonEnum";
import { CommonHelper } from "@src/Cores/Helpers";
import {
  useCommonHelper,
  useConfirmModal,
  useToast,
  useValidateHelper,
} from "@src/Cores/Hooks";
import {
  AuthorizeActionDefineModel,
  FormPropsDataModel,
  FormPropsModel,
  InputChangeModel,
  PropertyModel,
} from "@src/Cores/Models/CommonModels";
import { CoreRoleService, CoreUserService } from "@src/Cores/Services";
import { CoreUserEntity } from "@src/Cores/Services/Admin/CoreUserService";
import {
  ButtonTcd,
  CardTcd,
  CheckboxTcd,
  ColTcd,
  ContentTcd,
  FormGroupInputTcd,
  RowTcd,
  ToolbarTcd,
} from "@src/Cores/ShareComponents";
import { SelectDataModel } from "@src/Cores/Types/SelectDataModel";

//#endregion

export default function UserFormCpn(props: Readonly<FormPropsModel<unknown>>) {
  //#region constants
  const useCommonHelperState = useCommonHelper();
  const formId = useCommonHelperState.useGenerateFormId();
  const useToastState = useToast();
  const useConfirmModalState = useConfirmModal();
  const useValidateHelperState = useValidateHelper();
  const formDataDefault: ObjectModel = {};
  const listValidateModelConfig: PropertyModel[] = [
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
      name: "fullName",
      label: "Họ tên",
      rules: [
        {
          type: PropertyRuleTypeEnum.requied,
        },
        {
          type: PropertyRuleTypeEnum.maxLength,
          value: CommonConst.maxLengthOfName,
        },
      ],
    },
    {
      name: "nickName",
      label: "Tên khác",
      rules: [
        {
          type: PropertyRuleTypeEnum.maxLength,
          value: CommonConst.maxLengthOfName,
        },
      ],
    },
    {
      name: "email",
      label: "Email",
      rules: [
        {
          type: PropertyRuleTypeEnum.maxLength,
          value: CommonConst.maxLengthOfName,
        },
      ],
    },
    {
      name: "phone",
      label: "Điện thoại",
      rules: [
        {
          type: PropertyRuleTypeEnum.maxLength,
          value: CommonConst.maxLengthOfName,
        },
      ],
    },
    {
      name: "dateOfBirth",
      label: "Ngày sinh",
      rules: [
        {
          type: PropertyRuleTypeEnum.yearOfDateValid,
        },
      ],
    },
  ];
  const listPropertyTrim: string[] = [
    "userName",
    "fullName",
    "nickName",
    "email",
    "phone",
  ];
  const [listSelectRole, setListSelectRole] = useState<SelectDataModel[]>([]);

  //#endregion

  //#region state
  const isInitDataRef = useRef(false);
  const [formMode, setFormMode] = useState<FormModeEnum>(FormModeEnum.unknown);
  const [formData, setFormData] = useState<CoreUserEntity>({});
  const [formDataBackup, setFormDataBackup] = useState<CoreUserEntity>({});
  const [formError, setFormError] = useState<ObjectModel>({});
  const [isValidateWhenChange, setIsValidateWhenChange] = useState(false);
  const [isEditAfterAdd, setIsEditAfterAdd] = useState<boolean>(true);
  const [authorizeAction, setAuthorizeAction] =
    useState<AuthorizeActionDefineModel>({}); //Model chưa các action được phép truy cập
  const [loadingData, setLoadingData] = useState<ObjectBooleanModel>({
    form: false,
    save: false,
  });
  const [propsResetPassword, setPropsResetPassword] = useState<
    FormPropsDataModel<ResetPasswordModalCpnModel>
  >({ formMode: FormModeEnum.unknown });

  //#endregion

  //#region useEffects
  useEffect(() => {
    if (!props.formProps.stateId) {
      return;
    }

    clearData();
    setFormMode(props.formProps.formMode);

    if (
      props.formProps.formMode === FormModeEnum.detail ||
      props.formProps.formMode === FormModeEnum.edit
    ) {
      getData(props.formProps.formMode, props.formProps.recordId);
    }

    if (!isInitDataRef.current) {
      initData();
    }
  }, [props.formProps.stateId]);
  //#endregion

  //#region functions
  function initData() {
    isInitDataRef.current = true;
    CoreRoleService.GetListSelect().then((res) => {
      setListSelectRole(res);
    });
  }

  function getData(formModeParam?: FormModeEnum, recordId?: string) {
    handle_setLoadingData("form", true);
    CoreUserService.Get(recordId ?? formData.coreUserId)
      .then((res) => {
        if (res.isSuccess) {
          loadData(
            formModeParam ?? formMode,
            res.data ?? {},
            res.authorizeActionInfo?.authorizeAction
          );
        }
      })
      .finally(() => {
        handle_setLoadingData("form", false);
      });
  }

  function clearData() {
    setFormData({ ...formDataDefault });
    setFormDataBackup({ ...formDataDefault });
    setAuthorizeAction({});
    setFormError({});
  }

  function loadData(
    formModeParam: FormModeEnum,
    formDataParam: MemberAndUserModel,
    authorizeActionParam?: AuthorizeActionDefineModel
  ) {
    setFormMode(formModeParam);
    setFormData({ ...formDataParam });
    setFormDataBackup(CommonHelper.cloneObject(formDataParam));
    setAuthorizeAction(authorizeActionParam ?? {});
    setIsValidateWhenChange(false);
    setFormError({});
  }

  function add(formDataParam: MemberAndUserModel) {
    handle_setLoadingData("save", true);

    CoreUserService.Add(formDataParam)
      .then((res) => {
        if (res.isSuccess) {
          useToastState.showToast(NotifyTypeEnum.success, res.message);
          if (isEditAfterAdd) {
            getData(FormModeEnum.edit, res.data?.coreUserId);
            props.onFormModeChange?.({
              formMode: FormModeEnum.edit,
              recordId: res.data?.coreUserId,
            });
          }
          props.onDataChange?.();
        }
      })
      .finally(() => {
        handle_setLoadingData("save", false);
      });
  }

  function edit(formDataParam: MemberAndUserModel) {
    handle_setLoadingData("save", true);

    CoreUserService.Update(formDataParam)
      .then((res) => {
        if (res.isSuccess) {
          useToastState.showToast(NotifyTypeEnum.success, res.message);
          getData();
          props.onDataChange?.();
        }
      })
      .finally(() => {
        handle_setLoadingData("save", false);
      });
  }

  function save() {
    const formDataTemp = { ...formData };
    CommonHelper.trimModel(formDataTemp, listPropertyTrim);

    if (!handleValidateForm(formDataTemp)) return;

    if (formMode === FormModeEnum.add) {
      add(formDataTemp);
    } else if (formMode === FormModeEnum.edit) {
      edit(formDataTemp);
    }
  }

  function reset() {
    loadData(
      formMode,
      CommonHelper.cloneObject(formDataBackup),
      authorizeAction
    );
  }

  function detailClick() {
    props.onFormModeChange?.({
      formMode: FormModeEnum.detail,
      recordId: formData.coreUserId,
    });
    loadData(
      FormModeEnum.detail,
      CommonHelper.cloneObject(formDataBackup),
      authorizeAction
    );
  }

  function editClick() {
    props.onFormModeChange?.({
      formMode: FormModeEnum.edit,
      recordId: formData.coreUserId,
    });
    loadData(
      FormModeEnum.edit,
      CommonHelper.cloneObject(formDataBackup),
      authorizeAction
    );
  }

  function exitForm(isDataChangeParam?: boolean) {
    props.onExit?.(isDataChangeParam);
    clearData();
  }

  function deleteClick() {
    useConfirmModalState.confirm({
      message: "Bạn có chắc muốn xóa bản ghi này",
      onOk: () => {
        handle_setLoadingData("form", true);
        CoreUserService.Delete(formData.coreUserId)
          .then((res) => {
            if (res.isSuccess) {
              useToastState.showToast(NotifyTypeEnum.success, res.message);
              exitForm(true);
            }
          })
          .finally(() => {
            handle_setLoadingData("form", false);
          });
      },
    });
  }

  function addClick() {
    loadData(FormModeEnum.add, formDataDefault);
    props.onFormModeChange?.({
      formMode: FormModeEnum.add,
    });
  }

  function resetPasswordClick() {
    const propsTemp = { ...propsResetPassword };
    propsTemp.dataExtend = {
      coreUserId: formData.coreUserId,
      userName: formData.userName,
      fullName: formData.fullName,
    };
    propsTemp.stateId = CommonHelper.generateFormStateId();
    setPropsResetPassword(propsTemp);
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

  //#region private components
  function mainComponent() {
    return (
      <CardTcd title="Thông tin cá nhân">
        <RowTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Vai trò"
              name="listRoleId"
              id={`${formId}listRoleId`}
              inputType={InputTypeEnum.select}
              isMultiple={true}
              readOnly={formMode === FormModeEnum.detail}
              value={formData.listRoleId}
              options={listSelectRole}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("listRoleId", e.value);
              }}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Tài khoản"
              name="userName"
              readOnly={
                formMode === FormModeEnum.edit ||
                formMode === FormModeEnum.detail
              }
              inputType={InputTypeEnum.text}
              isShowRequired
              id={`${formId}userName`}
              value={formData.userName}
              error={formError.userName}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("userName", e.value);
              }}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Họ tên"
              name="fullName"
              readOnly={formMode === FormModeEnum.detail}
              inputType={InputTypeEnum.text}
              isShowRequired
              id={`${formId}fullName`}
              value={formData.fullName}
              error={formError.fullName}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("fullName", e.value);
              }}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Tên khác"
              name="nickName"
              id={`${formId}nickName`}
              readOnly={formMode === FormModeEnum.detail}
              inputType={InputTypeEnum.text}
              value={formData.nickName}
              error={formError.nickName}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("nickName", e.value);
              }}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Email"
              name="email"
              id={`${formId}email`}
              readOnly={formMode === FormModeEnum.detail}
              inputType={InputTypeEnum.text}
              value={formData.email}
              error={formError.email}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("email", e.value);
              }}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Điện thoại"
              name="phone"
              id={`${formId}phone`}
              readOnly={formMode === FormModeEnum.detail}
              inputType={InputTypeEnum.text}
              value={formData.phone}
              error={formError.phone}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("phone", e.value);
              }}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Ngày sinh"
              name="dateOfBirth"
              id={`${formId}dateOfBirth`}
              readOnly={formMode === FormModeEnum.detail}
              inputType={InputTypeEnum.dateTime}
              value={formData.dateOfBirth}
              error={formError.dateOfBirth}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("dateOfBirth", e.value);
              }}
            />
          </ColTcd>
        </RowTcd>
      </CardTcd>
    );
  }

  function getToolbar_Detail() {
    return (
      <ToolbarTcd.Container>
        <ToolbarTcd.Left>
          {authorizeAction.edit && (
            <ButtonTcd
              text="Chỉnh sửa"
              color={CommonConst.classColor.success}
              icon={CommonConst.classIcon.edit}
              onClick={editClick}
            ></ButtonTcd>
          )}
          {authorizeAction.add && (
            <ButtonTcd
              text="Thêm mới"
              color={CommonConst.classColor.primary}
              icon={CommonConst.classIcon.add}
              onClick={addClick}
            ></ButtonTcd>
          )}
          {authorizeAction.delete && (
            <ButtonTcd
              text="Xóa"
              color={CommonConst.classColor.danger}
              icon={CommonConst.classIcon.delete}
              onClick={deleteClick}
            ></ButtonTcd>
          )}
          {authorizeAction.resetPasswordOtherUser && (
            <ButtonTcd
              text="Reset mật khẩu"
              color={CommonConst.classColor.warning}
              icon={CommonConst.classIcon.key}
              onClick={resetPasswordClick}
            ></ButtonTcd>
          )}
        </ToolbarTcd.Left>

        <ToolbarTcd.Right>
          <ButtonTcd
            text="Danh sách"
            color={CommonConst.classColor.primary}
            icon={CommonConst.classIcon.list}
            onClick={() => {
              exitForm();
            }}
          ></ButtonTcd>
        </ToolbarTcd.Right>
      </ToolbarTcd.Container>
    );
  }

  function getToolbar_Add() {
    return (
      <ToolbarTcd.Container>
        <ToolbarTcd.Left>
          <ButtonTcd
            text="Lưu lại"
            color={CommonConst.classColor.success}
            icon={CommonConst.classIcon.save}
            isLoading={loadingData.save}
            onClick={save}
          ></ButtonTcd>
          <ButtonTcd
            text="Nhập lại"
            color={CommonConst.classColor.primary}
            icon={CommonConst.classIcon.reset}
            onClick={reset}
          ></ButtonTcd>
          <CheckboxTcd
            value={isEditAfterAdd}
            id={`${formId}isEditAfterAdd`}
            onChange={(e: InputChangeModel) => {
              setIsEditAfterAdd(e.value);
            }}
            label="Sửa sau khi thêm"
          ></CheckboxTcd>
        </ToolbarTcd.Left>
        <ToolbarTcd.Right>
          <ButtonTcd
            text="Danh sách"
            color={CommonConst.classColor.primary}
            icon={CommonConst.classIcon.list}
            onClick={() => {
              exitForm();
            }}
          ></ButtonTcd>
        </ToolbarTcd.Right>
      </ToolbarTcd.Container>
    );
  }

  function getToolbar_Edit() {
    return (
      <ToolbarTcd.Container>
        <ToolbarTcd.Left>
          <ButtonTcd
            text="Lưu lại"
            color={CommonConst.classColor.success}
            icon={CommonConst.classIcon.save}
            isLoading={loadingData.save}
            onClick={save}
          ></ButtonTcd>
          <ButtonTcd
            text="Nhập lại"
            color={CommonConst.classColor.primary}
            icon={CommonConst.classIcon.reset}
            onClick={reset}
          ></ButtonTcd>
          <ButtonTcd
            text="Chi tiết"
            color={CommonConst.classColor.info}
            icon={CommonConst.classIcon.view}
            onClick={detailClick}
          ></ButtonTcd>
        </ToolbarTcd.Left>
        <ToolbarTcd.Right>
          <ButtonTcd
            text="Danh sách"
            color={CommonConst.classColor.primary}
            icon={CommonConst.classIcon.list}
            onClick={() => {
              props.onExit?.();
            }}
          ></ButtonTcd>
        </ToolbarTcd.Right>
      </ToolbarTcd.Container>
    );
  }

  function toolbarComponent() {
    return (
      <>
        {formMode === FormModeEnum.detail && getToolbar_Detail()}
        {formMode === FormModeEnum.add && getToolbar_Add()}
        {formMode === FormModeEnum.edit && getToolbar_Edit()}
      </>
    );
  }
  //#endregion

  //#region mainReturn
  return (
    <>
      <ContentTcd
        isLoading={loadingData.form}
        title={
          <>
            {formMode === FormModeEnum.add && "Thêm mới "}
            {formMode === FormModeEnum.detail && "Chi tiết "}
            {formMode === FormModeEnum.edit && "Chỉnh sửa "}
            người dùng
          </>
        }
      >
        {toolbarComponent()}

        {mainComponent()}

        <OtherInfoForFormCpn
          formData={formData}
          isOpen={formMode !== FormModeEnum.add}
        ></OtherInfoForFormCpn>
      </ContentTcd>

      <ResetPasswordModalCpn
        formProps={propsResetPassword}
      ></ResetPasswordModalCpn>
    </>
  );
  //#endregion
}

//#region private functions

//#endregion
