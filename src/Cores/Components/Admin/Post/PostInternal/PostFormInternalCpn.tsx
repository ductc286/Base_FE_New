//#region imports
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";

import OtherInfoForFormCpn from "@src/Cores/Components/ShareComponents/OtherInfoForFormCpn";
import { CommonConst } from "@src/Cores/Constants";
import {
  FormModeEnum,
  InputTypeEnum,
  NotifyTypeEnum,
  PropertyRuleTypeEnum,
  SizeEnum,
} from "@src/Cores/Enums/CommonEnum";
import { CommonHelper, DateTimeHelper } from "@src/Cores/Helpers";
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
import { UtilService } from "@src/Cores/Services";
import CorePostCategoryInternalService from "@src/Cores/Services/Admin/Post/CorePostCategoryInternalService";
import CorePostInternalService from "@src/Cores/Services/Admin/Post/CorePostInternalService";
import {
  CorePostEntity,
  CorePostStatusHistoryEntity,
} from "@src/Cores/Services/Admin/Post/CorePostService";
import {
  ButtonTcd,
  CardTcd,
  CheckboxTcd,
  ColTcd,
  ContentTcd,
  FormGroupInputTcd,
  MesageTcd,
  RowTcd,
  TableTcd,
  ToolbarTcd,
  UpLoadTcd,
} from "@src/Cores/ShareComponents";
import {
  ColumnRenderParamTcd,
  TableColumnTcdModel,
  TableRefTcd,
  TableSettingTcd,
} from "@src/Cores/ShareComponents/Table/TableCommon";
import { SelectDataModel } from "@src/Cores/Types/SelectDataModel";

// import "jodit/build/jodit.min.css";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

//#endregion
interface MyStateMol {
  dataShow: {
    mainInfo?: boolean;
    otherInfo?: boolean;
    content?: boolean;
    history?: boolean;
  };
  listSelectPostCategory: SelectDataModel[];
}
export default function PostFormInternalCpn(
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
  const formState = useForm<FormStateModel<CorePostEntity>>({
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
  const currentRecordId = formState.watch("formData.corePostId");
  const formMyState = useForm<MyStateMol>({
    defaultValues: {
      dataShow: {
        mainInfo: true,
        otherInfo: true,
        content: true,
        history: true,
      },
    },
  });
  const dataShow = formMyState.watch("dataShow");
  const editorConfig = useMemo<any>(() => {
    return {
      readonly: formMode === FormModeEnum.detail,
    };
  }, [formMode]);
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
    CorePostCategoryInternalService.GetListSelect().then((res) => {
      formMyState.setValue("listSelectPostCategory", res);
    });
  }

  function getData(formModeParam?: FormModeEnum, recordId?: string) {
    handle_setLoadingData("form", true);
    CorePostInternalService.Get(recordId ?? currentRecordId)
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
    formDataParam: CorePostEntity,
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

  function add(formDataParam: CorePostEntity) {
    handle_setLoadingData("save", true);

    CorePostInternalService.Add(formDataParam)
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

  function edit(formDataParam: CorePostEntity) {
    handle_setLoadingData("save", true);

    CorePostInternalService.Update(formDataParam)
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

  function addClick() {
    loadData(FormModeEnum.add, formDataDefault);
    props.onFormModeChange?.({
      formMode: FormModeEnum.add,
    });
  }

  function handleValidateInput(
    propertyName: keyof CorePostEntity,
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

  function handleValidateForm(formDataParam?: CorePostEntity) {
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

  function handle_setFormData(propertyName: keyof CorePostEntity, value?: any) {
    formState.setValue(`formData.${propertyName}`, value);
    if (formState.getValues("isValidateWhenChange")) {
      handleValidateInput(propertyName, value);
    }
  }

  function handleSetDataShow(
    propertyName: keyof MyStateMol["dataShow"],
    value?: boolean
  ) {
    formMyState.setValue(`dataShow.${propertyName}`, value);
  }
  //#endregion

  //#region private components
  function mainComponent() {
    return (
      <CardTcd
        title="Thông tin bài đăng"
        isOpen={dataShow.mainInfo}
        isCanCollapse
        onChangeOpen={(isOpen) => {
          handleSetDataShow("mainInfo", isOpen);
        }}
      >
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
              label="Trạng thái"
              name="statusText"
              readOnly={true}
              inputType={InputTypeEnum.text}
              id={`${formId}statusText`}
              value={formData.statusText}
              error={formError.statusText}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("statusText", e.value);
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
              label="Danh mục"
              name="corePostCategoryId"
              id={`${formId}corePostCategoryId`}
              readOnly={formMode === FormModeEnum.detail}
              inputType={InputTypeEnum.select}
              options={formMyState.watch("listSelectPostCategory")}
              showClear
              value={formData.corePostCategoryId}
              error={formError.corePostCategoryId}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("corePostCategoryId", e.value);
              }}
            />
          </ColTcd>
        </RowTcd>
        <RowTcd>
          <ColTcd>
            <FormGroupInputTcd
              label="Miêu tả"
              name="description"
              id={`${formId}description`}
              readOnly={formMode === FormModeEnum.detail}
              inputType={InputTypeEnum.textarea}
              isShowRequired
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
          {authorizeAction.requestApproval && (
            <ButtonTcd
              text="Gửi duyệt"
              color={CommonConst.classColor.success}
              isLoading={loadingData.requestApprove}
              onClick={() => {
                handle_setLoadingData("requestApprove", true);
                CorePostInternalService.RequestApprove({
                  recordId: formData.corePostId,
                })
                  .then((res) => {
                    if (res.isSuccess) {
                      useToastState.showToast(
                        NotifyTypeEnum.success,
                        res.message
                      );
                      getData();
                      props.onDataChange?.();
                    }
                  })
                  .finally(() => {
                    handle_setLoadingData("requestApprove", false);
                  });
              }}
            ></ButtonTcd>
          )}
          {authorizeAction.approve && (
            <ButtonTcd
              text="Phê duyệt"
              color={CommonConst.classColor.success}
              isLoading={loadingData.approve}
              onClick={() => {
                handle_setLoadingData("approve", true);
                CorePostInternalService.Approve({
                  recordId: formData.corePostId,
                })
                  .then((res) => {
                    if (res.isSuccess) {
                      useToastState.showToast(
                        NotifyTypeEnum.success,
                        res.message
                      );
                      getData();
                      props.onDataChange?.();
                    }
                  })
                  .finally(() => {
                    handle_setLoadingData("approve", false);
                  });
              }}
            ></ButtonTcd>
          )}
          {authorizeAction.publish && (
            <ButtonTcd
              text="Xuất bản"
              color={CommonConst.classColor.success}
              isLoading={loadingData.publish}
              onClick={() => {
                handle_setLoadingData("publish", true);
                CorePostInternalService.Publish({
                  recordId: formData.corePostId,
                })
                  .then((res) => {
                    if (res.isSuccess) {
                      useToastState.showToast(
                        NotifyTypeEnum.success,
                        res.message
                      );
                      getData();
                      props.onDataChange?.();
                    }
                  })
                  .finally(() => {
                    handle_setLoadingData("publish", false);
                  });
              }}
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
          {authorizeAction.reject && (
            <ButtonTcd
              text="Từ chối"
              color={CommonConst.classColor.primary}
              isLoading={loadingData.reject}
              onClick={() => {
                useConfirmModalState.confirm({
                  isShowNote: true,
                  title: "Từ chối duyệt bài đăng",
                  onOk: (note) => {
                    handle_setLoadingData("reject", true);
                    CorePostInternalService.Reject({
                      recordId: formData.corePostId,
                      note,
                    })
                      .then((res) => {
                        if (res.isSuccess) {
                          useToastState.showToast(
                            NotifyTypeEnum.success,
                            res.message
                          );
                          getData();
                          props.onDataChange?.();
                        }
                      })
                      .finally(() => {
                        handle_setLoadingData("reject", false);
                      });
                  },
                });
              }}
            ></ButtonTcd>
          )}
          {authorizeAction.cancelRequestApproval && (
            <ButtonTcd
              text="Huỷ chờ duyệt"
              color={CommonConst.classColor.primary}
              isLoading={loadingData.cancelRequestApproval}
              onClick={() => {
                useConfirmModalState.confirm({
                  title: "Hủy chờ duyệt",
                  isShowNote: true,
                  onOk: (note?: string) => {
                    handle_setLoadingData("cancelRequestApproval", true);
                    CorePostInternalService.CancelRequestApproval({
                      recordId: formData.corePostId,
                      note: note,
                    })
                      .then((res) => {
                        if (res.isSuccess) {
                          useToastState.showToast(
                            NotifyTypeEnum.success,
                            res.message
                          );
                          getData();
                          props.onDataChange?.();
                        }
                      })
                      .finally(() => {
                        handle_setLoadingData("cancelRequestApproval", false);
                      });
                  },
                });
              }}
            ></ButtonTcd>
          )}
          {authorizeAction.cancelApprove && (
            <ButtonTcd
              text="Huỷ duyệt"
              color={CommonConst.classColor.primary}
              isLoading={loadingData.cancelApprove}
              onClick={() => {
                useConfirmModalState.confirm({
                  isShowNote: true,
                  title: "Hủy duyệt",
                  onOk: (note) => {
                    handle_setLoadingData("cancelApprove", true);
                    CorePostInternalService.CancelApprove({
                      recordId: formData.corePostId,
                      note,
                    })
                      .then((res) => {
                        if (res.isSuccess) {
                          useToastState.showToast(
                            NotifyTypeEnum.success,
                            res.message
                          );
                          getData();
                          props.onDataChange?.();
                        }
                      })
                      .finally(() => {
                        handle_setLoadingData("cancelApprove", false);
                      });
                  },
                });
              }}
            ></ButtonTcd>
          )}
          {authorizeAction.cancelPublish && (
            <ButtonTcd
              text="Huỷ xuất bản"
              color={CommonConst.classColor.primary}
              isLoading={loadingData.cancelPublish}
              onClick={() => {
                useConfirmModalState.confirm({
                  isShowNote: true,
                  title: "Hủy xuất bản",
                  onOk: (note) => {
                    handle_setLoadingData("cancelPublish", true);
                    CorePostInternalService.CancelPublish({
                      recordId: formData.corePostId,
                      note,
                    })
                      .then((res) => {
                        if (res.isSuccess) {
                          useToastState.showToast(
                            NotifyTypeEnum.success,
                            res.message
                          );
                          getData();
                          props.onDataChange?.();
                        }
                      })
                      .finally(() => {
                        handle_setLoadingData("cancelPublish", false);
                      });
                  },
                });
              }}
            ></ButtonTcd>
          )}
          {authorizeAction.cancel && (
            <ButtonTcd
              text="Huỷ bài đăng"
              color={CommonConst.classColor.danger}
              isLoading={loadingData.cancel}
              onClick={() => {
                useConfirmModalState.confirm({
                  isShowNote: true,
                  title: "Huỷ bài đăng",
                  message: (
                    <MesageTcd
                      text="Bài đăng hủy sẽ không được sử dụng và hoàn tác"
                      type={NotifyTypeEnum.warning}
                    ></MesageTcd>
                  ),
                  onOk: (note) => {
                    handle_setLoadingData("cancel", true);
                    CorePostInternalService.Cancel({
                      recordId: formData.corePostId,
                      note,
                    })
                      .then((res) => {
                        if (res.isSuccess) {
                          useToastState.showToast(
                            NotifyTypeEnum.success,
                            res.message
                          );
                          getData();
                          props.onDataChange?.();
                        }
                      })
                      .finally(() => {
                        handle_setLoadingData("cancel", false);
                      });
                  },
                });
              }}
            ></ButtonTcd>
          )}
          {authorizeAction.delete && (
            <ButtonTcd
              text="Xóa"
              color={CommonConst.classColor.danger}
              icon={CommonConst.classIcon.delete}
              onClick={() => {
                useConfirmModalState.confirm({
                  message: "Bạn có chắc muốn xóa bản ghi này?",
                  onOk: () => {
                    handle_setLoadingData("delete", true);
                    CorePostInternalService.Delete(formData.corePostId)
                      .then((res) => {
                        if (res.isSuccess) {
                          useToastState.showToast(
                            NotifyTypeEnum.success,
                            res.message
                          );
                          exitForm(true);
                        }
                      })
                      .finally(() => {
                        handle_setLoadingData("delete", false);
                      });
                  },
                });
              }}
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

  function contentComponent() {
    return (
      <CardTcd
        title="Nội dung"
        isOpen={dataShow.content}
        isCanCollapse
        onChangeOpen={(isOpen) => {
          handleSetDataShow("content", isOpen);
        }}
        headerButtonRight={
          <UpLoadTcd
            className="tcd-toolbar-item"
            disabled={formMode === FormModeEnum.detail}
            size={SizeEnum.small}
            onChange={(dataPram: InputChangeModel) => {
              dataPram.value.length > 0 &&
                CorePostInternalService.UploadImage(dataPram.value[0]).then(
                  (res) => {
                    if (res.isSuccess) {
                      useToastState.showToast(
                        NotifyTypeEnum.success,
                        "Đã tải ảnh và sao chép đường dẫn"
                      );
                      const url = CommonHelper.getAbsolutePath(res.data);
                      navigator.clipboard.writeText(url ?? "");
                    }
                  }
                );
            }}
          ></UpLoadTcd>
        }
      >
        <div className="editor-post">
          <JoditEditor
            config={editorConfig}
            value={formData.content ?? ""} //Phải cho chuỗi trống thay vì null thì nó mới update trên giao diện value mới
            onBlur={(newContent: any) => {
              handle_setFormData("content", newContent);
            }} // preferred to use only this option to update the content for performance reasons
            // onChange={(newContent) => { }}
          />
        </div>
      </CardTcd>
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
          bài đăng
        </>
      }
    >
      {toolbarComponent()}

      {mainComponent()}

      {contentComponent()}

      {formMode !== FormModeEnum.add && (
        <>
          <OtherInfoForFormCpn
            formData={formData}
            isOpen={dataShow.otherInfo}
            isCanCollapse
            onChangeOpen={(isOpen) => {
              handleSetDataShow("otherInfo", isOpen);
            }}
          ></OtherInfoForFormCpn>
          <ListHistoryCpn
            data={formData.statusHistory}
            isOpen={dataShow.history}
            isCanCollapse
            onChangeOpen={(isOpen) => {
              handleSetDataShow("history", isOpen);
            }}
          ></ListHistoryCpn>
        </>
      )}
    </ContentTcd>
  );
  //#endregion
}

//#region private functions
interface ListHistoryCpnModel {
  data?: CorePostStatusHistoryEntity[];
  isOpen?: boolean;
  isCanCollapse?: boolean;
  onChangeOpen?: (isOpen?: boolean) => void;
}
function ListHistoryCpn(props: Readonly<ListHistoryCpnModel>) {
  const tableRef = useRef<TableRefTcd<CorePostStatusHistoryEntity>>(null);
  const columnConfig = useMemo<
    TableColumnTcdModel<CorePostStatusHistoryEntity>[]
  >(
    () => [
      { field: "statusText", header: "Trạng thái", width: 100 },
      { field: "typeText", header: "Hành động", width: 100 },
      { field: "note", header: "Ghi chú", minWidth: 50 },
      {
        field: "timeChangeStatus",
        header: "Thời gian",
        width: 100,
        render: (param: ColumnRenderParamTcd<CorePostStatusHistoryEntity>) =>
          DateTimeHelper.getDateTimeString(param.rowData.timeChangeStatus),
      },
    ],
    []
  );

  return (
    <CardTcd
      title="Lịch sử thay đổi trạng thái"
      isOpen={props.isOpen}
      onChangeOpen={props.onChangeOpen}
      isCanCollapse={props.isCanCollapse}
      headerButtonRight={
        <TableSettingTcd
          tableApi={tableRef.current}
          size={SizeEnum.small}
        ></TableSettingTcd>
      }
    >
      <TableTcd
        columnConfigs={columnConfig}
        data={props.data}
        height={CommonConst.table.heightDefault}
        sortableDefault={false}
        ref={tableRef}
      />
    </CardTcd>
  );
}

//#endregion
