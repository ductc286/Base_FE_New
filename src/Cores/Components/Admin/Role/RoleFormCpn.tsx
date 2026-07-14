//#region imports
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import OtherInfoForFormCpn from "@src/Cores/Components/ShareComponents/OtherInfoForFormCpn";
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
  FormPropsModel,
  FormStateModel,
  InputChangeModel,
  PropertyModel,
} from "@src/Cores/Models/CommonModels";
import CoreRoleService, {
  CoreRoleEntity,
} from "@src/Cores/Services/Admin/CoreRoleService";
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

//#endregion

export default function RoleFormCpn(props: Readonly<FormPropsModel<unknown>>) {
  //#region constants
  const useCommonHelperState = useCommonHelper();
  const formId = useCommonHelperState.useGenerateFormId();
  const useToastState = useToast();
  const useConfirmModalState = useConfirmModal();
  const useValidateHelperState = useValidateHelper();
  const formDataDefault: ObjectModel = {};
  const listValidateModelConfig: PropertyModel[] = [
    {
      name: "name",
      label: "Tên",
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
      name: "description",
      label: "Miêu tả",
      rules: [
        {
          type: PropertyRuleTypeEnum.maxLength,
          value: CommonConst.maxLengthOfName,
        },
      ],
    },
  ];
  const listPropertyTrim: string[] = ["name", "description"];

  //#endregion

  //#region state
  const isInitDataRef = useRef(false);
  const formMyState = useForm<FormStateModel<CoreRoleEntity>>({
    defaultValues: {
      formMode: FormModeEnum.unknown,
      formData: {},
      formError: {},
      formDataBackup: {},
      authorizeAction: {},
      loadingData: {
        form: false,
        save: false,
      },
    },
  });
  const { formData, formError, formMode, authorizeAction, loadingData } =
    formMyState.watch();
  const currentRecordId = formMyState.watch("formData.coreRoleId");
  //#endregion

  //#region useEffects
  useEffect(() => {
    if (!props.formProps.stateId) {
      return;
    }

    clearData();
    formMyState.setValue("formMode", props.formProps.formMode);

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
  }

  function getData(formModeParam?: FormModeEnum, recordId?: string) {
    handle_setLoadingData("form", true);
    CoreRoleService.Get(recordId ?? currentRecordId)
      .then((res) => {
        if (res.isSuccess) {
          loadData(
            formModeParam ?? formMyState.getValues("formMode"),
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
    formMyState.setValue("formData", { ...formDataDefault });
    formMyState.setValue("formDataBackup", { ...formDataDefault });
    formMyState.setValue("authorizeAction", {});
    formMyState.setValue("formError", {});
  }

  function loadData(
    formModeParam: FormModeEnum,
    formDataParam: CoreRoleEntity,
    authorizeActionParam?: AuthorizeActionDefineModel
  ) {
    formMyState.setValue("formMode", formModeParam);
    formMyState.setValue("formData", { ...formDataParam });
    formMyState.setValue(
      "formDataBackup",
      CommonHelper.cloneObject(formDataParam)
    );
    formMyState.setValue("authorizeAction", authorizeActionParam ?? {});
    formMyState.setValue("formError", {});
    formMyState.setValue("isValidateWhenChange", false);
  }

  function add(formDataParam: CoreRoleEntity) {
    handle_setLoadingData("save", true);

    CoreRoleService.Add(formDataParam)
      .then((res) => {
        if (res.isSuccess) {
          useToastState.showToast(NotifyTypeEnum.success, res.message);
          if (formMyState.watch("isEditAfterAdd")) {
            getData(FormModeEnum.edit, res.data?.coreRoleId);
            props.onFormModeChange?.({
              formMode: FormModeEnum.edit,
              recordId: res.data?.coreRoleId,
            });
          }
          props.onDataChange?.();
        }
      })
      .finally(() => {
        handle_setLoadingData("save", false);
      });
  }

  function edit(formDataParam: CoreRoleEntity) {
    handle_setLoadingData("save", true);

    CoreRoleService.Update(formDataParam)
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
    const formDataTemp = { ...formMyState.getValues("formData") };
    CommonHelper.trimModel(formDataTemp, listPropertyTrim);

    if (!handleValidateForm(formDataTemp)) return;

    if (formMyState.getValues("formMode") === FormModeEnum.add) {
      add(formDataTemp);
    } else if (formMyState.getValues("formMode") === FormModeEnum.edit) {
      edit(formDataTemp);
    }
  }

  function reset() {
    loadData(
      formMyState.getValues("formMode"),
      CommonHelper.cloneObject(formMyState.getValues("formDataBackup")),
      formMyState.getValues("authorizeAction")
    );
  }

  function detailClick() {
    props.onFormModeChange?.({
      formMode: FormModeEnum.detail,
      recordId: currentRecordId,
    });
    loadData(
      FormModeEnum.detail,
      CommonHelper.cloneObject(formMyState.getValues("formDataBackup")),
      formMyState.getValues("authorizeAction")
    );
  }

  function editClick() {
    props.onFormModeChange?.({
      formMode: FormModeEnum.edit,
      recordId: currentRecordId,
    });
    loadData(
      FormModeEnum.edit,
      CommonHelper.cloneObject(formMyState.getValues("formDataBackup")),
      formMyState.getValues("authorizeAction")
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
        CoreRoleService.Delete(currentRecordId)
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

  function handleValidateInput(
    propertyName: keyof CoreRoleEntity,
    inputValue: any
  ) {
    if (listPropertyTrim.includes(propertyName) && inputValue) {
      inputValue = inputValue.trim();
    }

    const error = useValidateHelperState.validateModelColumn(
      inputValue,
      listValidateModelConfig,
      propertyName
    );
    formMyState.setValue(`formError.${propertyName}`, error);
  }

  function handleValidateForm(formDataParam?: CoreRoleEntity) {
    formDataParam ??= formMyState.getValues("formData");
    const validationData = useValidateHelperState.validateModel(
      formDataParam,
      listValidateModelConfig,
      formId
    );
    formMyState.setValue("formError", validationData.error);
    formMyState.setValue("isValidateWhenChange", true);

    return validationData.isValid;
  }

  function handle_setLoadingData(propertyName: string, value?: boolean) {
    formMyState.setValue(`formError.${propertyName}`, value);
  }

  function handle_setFormData(propertyName: keyof CoreRoleEntity, value?: any) {
    formMyState.setValue(`formData.${propertyName}`, value);
    if (formMyState.getValues("isValidateWhenChange")) {
      handleValidateInput(propertyName, value);
    }
  }

  //#endregion

  //#region private components
  function mainComponent() {
    return (
      <CardTcd title="Thông tin vai trò">
        <RowTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Mã"
              name="code"
              readOnly={true}
              inputType={InputTypeEnum.text}
              id={`${formId}code`}
              value={formData.code}
              error={formError.code}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("code", e.value);
              }}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Tên"
              name="name"
              readOnly={formMode === FormModeEnum.detail}
              inputType={InputTypeEnum.text}
              isShowRequired
              id={`${formId}name`}
              value={formData.name}
              error={formError.name}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("name", e.value);
              }}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Miêu tả"
              name="description"
              id={`${formId}description`}
              readOnly={formMode === FormModeEnum.detail}
              inputType={InputTypeEnum.text}
              value={formData.description}
              error={formError.description}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("description", e.value);
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
            value={formMyState.watch("isEditAfterAdd")}
            id={`${formId}isEditAfterAdd`}
            onChange={(e: InputChangeModel) => {
              formMyState.setValue("isEditAfterAdd", e.value);
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
    <ContentTcd
      isLoading={loadingData.form}
      title={
        <>
          {formMode === FormModeEnum.add && "Thêm mới "}
          {formMode === FormModeEnum.detail && "Chi tiết "}
          {formMode === FormModeEnum.edit && "Chỉnh sửa "}
          vai trò
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
  );
  //#endregion
}
