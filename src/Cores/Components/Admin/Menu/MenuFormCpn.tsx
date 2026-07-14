//#region imports
import { useEffect, useRef, useState } from "react";

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
  InputChangeModel,
  PropertyModel,
} from "@src/Cores/Models/CommonModels";
import { CoreMenuService } from "@src/Cores/Services";
import {
  CoreMenuEntity,
  MenuAuthorizeTypeEnum,
  MenuTypeCodeEnum,
} from "@src/Cores/Services/Admin/CoreMenuService";
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

export default function MenuFormCpn(props: Readonly<FormPropsModel<unknown>>) {
  //#region constants
  const useCommonHelperState = useCommonHelper();
  const formId = useCommonHelperState.useGenerateFormId();
  const useToastState = useToast();
  const useConfirmModalState = useConfirmModal();
  const useValidateHelperState = useValidateHelper();
  const formDataDefault: CoreMenuEntity = {
    menuTypeCode: "menuAdmin",
    levelItem: 1,
    authorizeType: MenuAuthorizeTypeEnum.logged,
  };
  const listValidateModelConfig: PropertyModel[] = [
    {
      name: "code",
      label: "Mã",
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
      name: "urlPath",
      label: "Đường dẫn URl",
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
      name: "className",
      label: "Class",
      rules: [
        {
          type: PropertyRuleTypeEnum.maxLength,
          value: CommonConst.maxLengthOfName,
        },
      ],
    },
    {
      name: "icon",
      label: "Icon",
      rules: [
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
          value: CommonConst.maxLengthOfCode,
        },
      ],
    },
  ];
  const listPropertyTrim: string[] = [
    "code",
    "name",
    "urlPath",
    "className",
    "icon",
    "description",
  ];
  const [listSelectMenu, setListSelectMenu] = useState<SelectDataModel[]>([]);
  const listSelectMenuType: SelectDataModel[] = [
    {
      value: MenuTypeCodeEnum[MenuTypeCodeEnum.menuDefault],
      label: MenuTypeCodeEnum[MenuTypeCodeEnum.menuDefault],
      labelSelected: MenuTypeCodeEnum[MenuTypeCodeEnum.menuDefault],
    },
    {
      value: MenuTypeCodeEnum[MenuTypeCodeEnum.pageDefault],
      label: MenuTypeCodeEnum[MenuTypeCodeEnum.pageDefault],
      labelSelected: MenuTypeCodeEnum[MenuTypeCodeEnum.pageDefault],
    },
    {
      value: MenuTypeCodeEnum[MenuTypeCodeEnum.menuAdmin],
      label: MenuTypeCodeEnum[MenuTypeCodeEnum.menuAdmin],
      labelSelected: MenuTypeCodeEnum[MenuTypeCodeEnum.menuAdmin],
    },
    {
      value: MenuTypeCodeEnum[MenuTypeCodeEnum.pageAdmin],
      label: MenuTypeCodeEnum[MenuTypeCodeEnum.pageAdmin],
      labelSelected: MenuTypeCodeEnum[MenuTypeCodeEnum.pageAdmin],
    },
  ];

  //#endregion

  //#region state
  const isInitDataRef = useRef(false);
  const [formMode, setFormMode] = useState<FormModeEnum>(FormModeEnum.unknown);
  const [formData, setFormData] = useState<CoreMenuEntity>({});
  const [formDataBackup, setFormDataBackup] = useState<CoreMenuEntity>({});
  const [formError, setFormError] = useState<ObjectModel>({});
  const [isValidateWhenChange, setIsValidateWhenChange] = useState(false);
  const [isEditAfterAdd, setIsEditAfterAdd] = useState<boolean>(true);
  const [authorizeAction, setAuthorizeAction] =
    useState<AuthorizeActionDefineModel>({}); //Model chưa các action được phép truy cập
  const [loadingData, setLoadingData] = useState<ObjectBooleanModel>({
    form: false,
    save: false,
  });

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
    CoreMenuService.GetListSelect().then((res) => {
      setListSelectMenu(res);
    });
  }

  function getData(formModeParam?: FormModeEnum, recordId?: string) {
    handle_setLoadingData("form", true);
    CoreMenuService.Get(recordId ?? formData.coreMenuId)
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
    formDataParam: CoreMenuEntity,
    authorizeActionParam?: AuthorizeActionDefineModel
  ) {
    setFormMode(formModeParam);
    setFormData({ ...formDataParam });
    setFormDataBackup(CommonHelper.cloneObject(formDataParam));
    setAuthorizeAction(authorizeActionParam ?? {});
    setIsValidateWhenChange(false);
    setFormError({});
  }

  function add(formDataParam: CoreMenuEntity) {
    handle_setLoadingData("save", true);

    CoreMenuService.Add(formDataParam)
      .then((res) => {
        if (res.isSuccess) {
          useToastState.showToast(NotifyTypeEnum.success, res.message);
          if (isEditAfterAdd) {
            getData(FormModeEnum.edit, res.data?.coreMenuId);
            props.onFormModeChange?.({
              formMode: FormModeEnum.edit,
              recordId: res.data?.coreMenuId,
            });
          }
          props.onDataChange?.();
        }
      })
      .finally(() => {
        handle_setLoadingData("save", false);
      });
  }

  function edit(formDataParam: CoreMenuEntity) {
    handle_setLoadingData("save", true);

    CoreMenuService.Update(formDataParam)
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
      recordId: formData.coreMenuId,
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
      recordId: formData.coreMenuId,
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
        CoreMenuService.Delete(formData.coreMenuId)
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

  function handleValidateForm(formDataParam?: CoreMenuEntity) {
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

  function handle_setFormData(propertyName: keyof CoreMenuEntity, value?: any) {
    setFormData((prevState: any) => {
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
      <CardTcd title="Thông tin menu">
        <RowTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Menu cha"
              name="parentId"
              id={`${formId}parentId`}
              inputType={InputTypeEnum.select}
              filter
              showClear
              readOnly={formMode === FormModeEnum.detail}
              value={formData.parentId}
              options={listSelectMenu}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("parentId", e.value);
              }}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Mã"
              name="code"
              readOnly={formMode === FormModeEnum.detail}
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
              }}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Đường dẫn URl"
              name="urlPath"
              id={`${formId}urlPath`}
              isShowRequired
              readOnly={formMode === FormModeEnum.detail}
              inputType={InputTypeEnum.text}
              value={formData.urlPath}
              error={formError.urlPath}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("urlPath", e.value);
              }}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Thứ tự"
              name="ordinal"
              id={`${formId}ordinal`}
              readOnly={formMode === FormModeEnum.detail}
              inputType={InputTypeEnum.number}
              value={formData.ordinal}
              error={formError.ordinal}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("ordinal", e.value);
              }}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Class"
              name="className"
              id={`${formId}className`}
              readOnly={formMode === FormModeEnum.detail}
              inputType={InputTypeEnum.text}
              value={formData.className}
              error={formError.className}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("className", e.value);
              }}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Icon"
              name="icon"
              id={`${formId}icon`}
              readOnly={formMode === FormModeEnum.detail}
              inputType={InputTypeEnum.text}
              value={formData.icon}
              error={formError.icon}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("icon", e.value);
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
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Phân loại"
              name="menuTypeCode"
              id={`${formId}menuTypeCode`}
              readOnly={formMode === FormModeEnum.detail}
              inputType={InputTypeEnum.select}
              value={formData.menuTypeCode}
              error={formError.menuTypeCode}
              options={listSelectMenuType}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("menuTypeCode", e.value);
              }}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Ẩn"
              name="isHide"
              id={`${formId}isHide`}
              readOnly={formMode === FormModeEnum.detail}
              inputType={InputTypeEnum.checkbox}
              value={formData.isHide}
              error={formError.isHide}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("isHide", e.value);
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
            menu
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
    </>
  );
  //#endregion
}
