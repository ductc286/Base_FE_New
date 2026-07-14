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
import { CorePostCategoryService, UtilService } from "@src/Cores/Services";
import { CorePostCategoryEntity } from "@src/Cores/Services/Admin/Post/CorePostCategoryService";
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

export default function PostCategoryFormCpn(
  props: Readonly<FormPropsModel<unknown>>
) {
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
      name: "urlFriendly",
      label: "Link thân thiện",
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
      name: "note",
      label: "Ghi chú",
      rules: [
        {
          type: PropertyRuleTypeEnum.maxLength,
          value: CommonConst.maxLengthOfName,
        },
      ],
    },
  ];
  const listPropertyTrim: string[] = ["name", "urlFriendly", "note"];

  //#endregion

  //#region state
  const isInitDataRef = useRef(false);
  const formState = useForm<FormStateModel<CorePostCategoryEntity>>({
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
    formState.watch();
  const currentRecordId = formState.watch("formData.corePostCategoryId");
  //#endregion

  //#region useEffects
  useEffect(() => {
    if (!props.formProps.stateId) {
      return;
    }

    clearData();
    formState.setValue("formMode", props.formProps.formMode);

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
    CorePostCategoryService.Get(recordId ?? currentRecordId)
      .then((res) => {
        if (res.isSuccess) {
          loadData(
            formModeParam ?? formState.getValues("formMode"),
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
    formState.setValue("formData", { ...formDataDefault });
    formState.setValue("formDataBackup", { ...formDataDefault });
    formState.setValue("authorizeAction", {});
    formState.setValue("formError", {});
  }

  function loadData(
    formModeParam: FormModeEnum,
    formDataParam: CorePostCategoryEntity,
    authorizeActionParam?: AuthorizeActionDefineModel
  ) {
    formState.setValue("formMode", formModeParam);
    formState.setValue("formData", { ...formDataParam });
    formState.setValue(
      "formDataBackup",
      CommonHelper.cloneObject(formDataParam)
    );
    formState.setValue("authorizeAction", authorizeActionParam ?? {});
    formState.setValue("formError", {});
    formState.setValue("isValidateWhenChange", false);
  }

  function add(formDataParam: CorePostCategoryEntity) {
    handle_setLoadingData("save", true);

    CorePostCategoryService.Add(formDataParam)
      .then((res) => {
        if (res.isSuccess) {
          useToastState.showToast(NotifyTypeEnum.success, res.message);
          if (formState.watch("isEditAfterAdd")) {
            getData(FormModeEnum.edit, res.data?.corePostCategoryId);
            props.onFormModeChange?.({
              formMode: FormModeEnum.edit,
              recordId: res.data?.corePostCategoryId,
            });
          }
          props.onDataChange?.();
        }
      })
      .finally(() => {
        handle_setLoadingData("save", false);
      });
  }

  function edit(formDataParam: CorePostCategoryEntity) {
    handle_setLoadingData("save", true);

    CorePostCategoryService.Update(formDataParam)
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
    const formDataTemp = { ...formState.getValues("formData") };
    CommonHelper.trimModel(formDataTemp, listPropertyTrim);

    if (!handleValidateForm(formDataTemp)) return;

    if (formState.getValues("formMode") === FormModeEnum.add) {
      add(formDataTemp);
    } else if (formState.getValues("formMode") === FormModeEnum.edit) {
      edit(formDataTemp);
    }
  }

  function reset() {
    loadData(
      formState.getValues("formMode"),
      CommonHelper.cloneObject(formState.getValues("formDataBackup")),
      formState.getValues("authorizeAction")
    );
  }

  function detailClick() {
    props.onFormModeChange?.({
      formMode: FormModeEnum.detail,
      recordId: currentRecordId,
    });
    loadData(
      FormModeEnum.detail,
      CommonHelper.cloneObject(formState.getValues("formDataBackup")),
      formState.getValues("authorizeAction")
    );
  }

  function editClick() {
    props.onFormModeChange?.({
      formMode: FormModeEnum.edit,
      recordId: currentRecordId,
    });
    loadData(
      FormModeEnum.edit,
      CommonHelper.cloneObject(formState.getValues("formDataBackup")),
      formState.getValues("authorizeAction")
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
        CorePostCategoryService.Delete(currentRecordId)
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
    propertyName: keyof CorePostCategoryEntity,
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
    formState.setValue(`formError.${propertyName}`, error);
  }

  function handleValidateForm(formDataParam?: CorePostCategoryEntity) {
    formDataParam ??= formState.getValues("formData");
    const validationData = useValidateHelperState.validateModel(
      formDataParam,
      listValidateModelConfig,
      formId
    );
    formState.setValue("formError", validationData.error);
    formState.setValue("isValidateWhenChange", true);

    return validationData.isValid;
  }

  function handle_setLoadingData(propertyName: string, value?: boolean) {
    formState.setValue(`formError.${propertyName}`, value);
  }

  function handle_setFormData(
    propertyName: keyof CorePostCategoryEntity,
    value?: any
  ) {
    formState.setValue(`formData.${propertyName}`, value);
    if (formState.getValues("isValidateWhenChange")) {
      handleValidateInput(propertyName, value);
    }
  }

  //#endregion

  //#region private components
  function mainComponent() {
    return (
      <CardTcd title="Thông tin danh mục">
        <RowTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Mã"
              name="code"
              readOnly={true}
              inputType={InputTypeEnum.text}
              isShowRequired
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
                UtilService.NormalizeUrlFriendly(e.value).then((res) => {
                  if (res.isSuccess) {
                    handle_setFormData("urlFriendly", res.data);
                  }
                });
              }}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Link thân thiện"
              name="urlFriendly"
              readOnly={formMode === FormModeEnum.detail}
              inputType={InputTypeEnum.text}
              isShowRequired
              id={`${formId}urlFriendly`}
              value={formData.urlFriendly}
              error={formError.urlFriendly}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("urlFriendly", e.value);
              }}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Ghi chú"
              name="note"
              id={`${formId}note`}
              readOnly={formMode === FormModeEnum.detail}
              inputType={InputTypeEnum.text}
              value={formData.note}
              error={formError.note}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("note", e.value);
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
            value={formState.watch("isEditAfterAdd")}
            id={`${formId}isEditAfterAdd`}
            onChange={(e: InputChangeModel) => {
              formState.setValue("isEditAfterAdd", e.value);
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
          danh mục
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
