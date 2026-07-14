//#region imports
import { useEffect, useMemo, useRef, useState } from "react";

import MemberService, {
  MemberAndUserModel,
  MemberFamilyModel,
} from "@src/AppForders/Services/MemberService";
import CommonConst from "@src/Cores/Constants/CommonConst";
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
  AuthorizeActionDto,
  FormPropsModel,
  InputChangeModel,
  PropertyModel,
} from "@src/Cores/Models/CommonModels";
import SelectDataService from "@src/Cores/Services/SelectDataService";
import {
  ButtonTcd,
  CardTcd,
  CheckboxTcd,
  ColTcd,
  ContentTcd,
  FormGroupDateTextTcd,
  FormGroupInputTcd,
  ImageTcd,
  RadioButtonTcd,
  RowTcd,
  TableTcd,
  ToolbarTcd,
} from "@src/Cores/ShareComponents";
import {
  TableColumnTcdModel,
  TableRefTcd,
  TableSettingTcd,
} from "@src/Cores/ShareComponents/Table/TableCommon";
import UpLoadTcd from "@src/Cores/ShareComponents/UpLoadTcd";
import { SelectDataModel } from "@src/Cores/Types/SelectDataModel";
//#endregion

export interface DataExtendModel {
  relationId?: string;
  relationName?: string;
}

export default function FamilyTreeFormCpn(
  props: Readonly<FormPropsModel<DataExtendModel>>
) {
  //#region constants
  const useCommonHelperState = useCommonHelper();
  const formId = useCommonHelperState.useGenerateFormId();
  const useToastState = useToast();
  const useConfirmModalState = useConfirmModal();
  const useValidateHelperState = useValidateHelper();
  const formDataDefault: MemberAndUserModel = {
    isFullDateOfBirth: true,
  };
  const configValidateModel: PropertyModel[] = [
    {
      name: "fullName",
      label: "Họ tên",
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
      name: "nickName",
      label: "Tên khác",
      rules: [
        {
          type: PropertyRuleTypeEnum.maxLength,
          value: CommonConst.maxLengthOfCode,
        },
      ],
    },
    {
      name: "yearOfBirth",
      label: "Năm sinh",
      rules: [
        {
          type: PropertyRuleTypeEnum.yearOfDateValid,
        },
      ],
    },
    {
      name: "dateOfBirth",
      label: "Ngày sinh",
      rules: [
        {
          type: PropertyRuleTypeEnum.dateValid,
        },
      ],
    },
    {
      name: "yearOfDie",
      label: "Năm mất",
      rules: [
        {
          type: PropertyRuleTypeEnum.yearOfDateValid,
        },
      ],
    },
    {
      name: "dateOfDie",
      label: "Ngày mất",
      rules: [
        {
          type: PropertyRuleTypeEnum.dateValid,
        },
      ],
    },
    {
      name: "burialGround",
      label: "Nơi chôn cất",
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
          value: CommonConst.maxLengthOfCode,
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
      name: "homeTown",
      label: "Nơi sinh",
      rules: [
        {
          type: PropertyRuleTypeEnum.maxLength,
          value: CommonConst.maxLengthOfName,
        },
      ],
    },
    {
      name: "currentAddress",
      label: "Nơi ở hiện tại",
      rules: [
        {
          type: PropertyRuleTypeEnum.maxLength,
          value: CommonConst.maxLengthOfName,
        },
      ],
    },
    {
      name: "career",
      label: "Nghề nghiệp",
      rules: [
        {
          type: PropertyRuleTypeEnum.maxLength,
          value: CommonConst.maxLengthOfName,
        },
      ],
    },
    {
      name: "urlAvatar",
      label: "Đường dẫn ảnh đại diện",
      rules: [
        {
          type: PropertyRuleTypeEnum.maxLength,
          value: CommonConst.maxLengthOfName,
        },
      ],
    },
  ];
  const listSelectRelation: SelectDataModel[] = [
    {
      value: "children",
      label: "Con cái",
    },
    {
      value: "spouse",
      label: "Vợ/chồng",
    },
  ];
  const listSelectSexCode = SelectDataService.GetSexSelect();
  //#endregion

  //#region state
  const [formMode, setFormMode] = useState<FormModeEnum>(FormModeEnum.unknown);
  const [formData, setFormData] = useState<MemberAndUserModel>({});
  const [formDataBackup, setFormDataBackup] = useState<any>({});
  const [formError, setFormError] = useState<ObjectModel>({});
  const [isValidateWhenChange, setIsValidateWhenChange] = useState(false);
  const [isEditAfterAdd, setIsEditAfterAdd] = useState<boolean>(true);
  const [authorizeAction, setAuthorizeAction] = useState<AuthorizeActionDto>(
    {}
  ); //Model chưa các action được phép truy cập
  const [relation, setRelation] = useState<string>();
  const [dataShow, setDataShow] = useState<ObjectBooleanModel>({
    thongTinKhac: true,
  });
  const [loadingData, setLoadingData] = useState<ObjectBooleanModel>({
    form: false,
    save: false,
  });
  const [listMemberInFamily, setListMemberInFamily] =
    useState<MemberFamilyModel[]>();
  //#endregion

  //#region useEffects
  useEffect(() => {
    clearData();
    setFormMode(props.formProps.formMode);

    if (
      props.formProps.formMode === FormModeEnum.detail ||
      props.formProps.formMode === FormModeEnum.edit
    ) {
      getData(props.formProps.formMode, props.formProps.recordId);
    }
  }, [props.formProps.stateId]);
  //#endregion

  //#region functions

  function getData(formModeParam?: FormModeEnum, recordId?: string) {
    handle_setLoadingData("form", true);
    MemberService.Get(recordId ?? formData.memberId)
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
    setRelation(undefined);
    setListMemberInFamily(undefined);
  }

  function loadData(
    formModeParam: FormModeEnum,
    formDataParam: MemberAndUserModel,
    authorizeActionParam?: AuthorizeActionDto
  ) {
    setFormMode(formModeParam);
    setFormData({ ...formDataParam, listMemberInFamily: undefined });
    setListMemberInFamily(formDataParam?.listMemberInFamily);
    setFormDataBackup(CommonHelper.cloneObject(formDataParam));
    setAuthorizeAction(authorizeActionParam ?? {});
    setIsValidateWhenChange(false);
    setFormError({});
  }

  function add(formDataParam: MemberAndUserModel) {
    const bodyData = CommonHelper.cloneObject(formDataParam);
    bodyData.parentId =
      relation === "children"
        ? props.formProps.dataExtend?.relationId
        : undefined;
    bodyData.spouseId =
      relation === "spouse"
        ? props.formProps.dataExtend?.relationId
        : undefined;
    handle_setLoadingData("save", true);

    MemberService.Add(bodyData)
      .then((res) => {
        if (res.isSuccess) {
          useToastState.showToast(NotifyTypeEnum.success, res.message);
          if (isEditAfterAdd) {
            getData(FormModeEnum.edit, res.data?.memberId);
            props.onFormModeChange?.({
              formMode: FormModeEnum.edit,
              recordId: res.data?.memberId,
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

    MemberService.Update(formDataParam)
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
    if (formMode === FormModeEnum.add && !relation) {
      useToastState.showToast(
        NotifyTypeEnum.warning,
        "Bạn cần chọn mối quan hệ"
      );
      return;
    }
    if (!handleValidateForm()) return;

    const formDataTemp = { ...formData };
    CommonHelper.trimModel(formDataTemp, [
      "fullName",
      "nickName",
      "urlAvatar",
      "career",
      "burialGround",
      "email",
      "phone",
    ]);

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
    setRelation(undefined);
  }

  function detailClick() {
    props.onFormModeChange?.({
      formMode: FormModeEnum.detail,
      recordId: formData.memberId,
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
      recordId: formData.memberId,
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
        MemberService.Delete(formData.memberId)
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

  function handleValidateInput(
    propertyName: string,
    inputValue: InputChangeModel
  ) {
    const error = useValidateHelperState.validateModelColumn(
      inputValue,
      configValidateModel,
      propertyName
    );
    setFormError((preState) => {
      return { ...preState, [propertyName]: error };
    });
  }

  function handleValidateForm() {
    const validationData = useValidateHelperState.validateModel(
      formData,
      configValidateModel,
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

  function handle_setDataShow(propertyName: string, value?: boolean) {
    setDataShow((prevState) => {
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
  function thongTinCaNhanComponent() {
    return (
      <CardTcd
        title="Thông tin cá nhân"
        isOpen={dataShow.thongTinCaNhan}
        onChangeOpen={(isOpen) => {
          handle_setDataShow("thongTinCaNhan", isOpen);
        }}
        isCanCollapse={true}
      >
        <RowTcd>
          {formMode === FormModeEnum.add && (
            <ColTcd config={CommonConst.configColDefault}>
              <FormGroupInputTcd
                label={"Mối quan hệ với: ".concat(
                  props.formProps.dataExtend?.relationName ?? ""
                )}
                name="realation"
                isShowRequired
                id={`${formId}realation`}
                inputType={InputTypeEnum.select}
                value={relation}
                options={listSelectRelation}
                onChange={(e: InputChangeModel) => {
                  setRelation(e.value);
                }}
              />
            </ColTcd>
          )}
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
              label="Giới tính"
              name="sexCode"
              id={`${formId}sexCode`}
              inputType={InputTypeEnum.select}
              readOnly={formMode === FormModeEnum.detail}
              value={formData.sexCode}
              error={formError.sexCode}
              options={listSelectSexCode}
              showClear={true}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("sexCode", e.value);
              }}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            {formData.isFullDateOfBirth !== false && (
              <FormGroupInputTcd
                label={
                  <OptionInputDateCpn
                    labelDate="Ngày sinh"
                    labelYear="Năm sinh"
                    name="isFullDateOfBirth"
                    readOnly={formMode === FormModeEnum.detail}
                    value={formData.isFullDateOfBirth}
                    onChange={(value: boolean) => {
                      setFormData({
                        ...formData,
                        isFullDateOfBirth: value,
                        dateOfBirth: value ? formData.dateOfDie : undefined,
                        yearOfBirth: !value ? formData.yearOfDie : undefined,
                      });
                    }}
                  />
                }
                name="dateOfBirth"
                id={`${formId}dateOfBirth`}
                infoContent="Dương lịch"
                inputType={InputTypeEnum.dateTime}
                readOnly={formMode === FormModeEnum.detail}
                value={formData.dateOfBirth}
                error={formError.dateOfBirth}
                onChange={(e: InputChangeModel) => {
                  handle_setFormData("dateOfBirth", e.value);
                }}
              />
            )}
            {formData.isFullDateOfBirth === false && (
              <FormGroupInputTcd
                label={
                  <OptionInputDateCpn
                    labelDate="Ngày sinh"
                    labelYear="Năm sinh"
                    readOnly={formMode === FormModeEnum.detail}
                    value={formData.isFullDateOfBirth}
                    onChange={(value: boolean) => {
                      setFormData({
                        ...formData,
                        isFullDateOfBirth: value,
                        dateOfBirth: value ? formData.dateOfDie : undefined,
                        yearOfBirth: !value ? formData.yearOfDie : undefined,
                      });
                    }}
                  />
                }
                name="yearOfBirth"
                id={`${formId}yearOfBirth`}
                infoContent="Dương lịch"
                inputType={InputTypeEnum.number}
                readOnly={formMode === FormModeEnum.detail}
                value={formData.yearOfBirth}
                error={formError.yearOfBirth}
                onChange={(e: InputChangeModel) => {
                  handle_setFormData("yearOfBirth", e.value);
                }}
              />
            )}
          </ColTcd>
        </RowTcd>
        <RowTcd>
          <ColTcd>
            <CheckboxTcd
              name="isDie"
              className="mt-2"
              label="Đã mất"
              id={`${formId}isDie`}
              readOnly={formMode === FormModeEnum.detail}
              value={formData.isDie}
              error={formError.isDie}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("isDie", e.value);
              }}
            ></CheckboxTcd>
          </ColTcd>
        </RowTcd>

        {formData.isDie && (
          <RowTcd>
            <ColTcd config={CommonConst.configColDefault}>
              <FormGroupDateTextTcd
                label="Ngày mất(âm lịch)"
                name="dateOfDie"
                id={`${formId}dateOfDie`}
                readOnly={formMode === FormModeEnum.detail}
                value={formData.dateOfDie}
                error={formError.dateOfDie}
                valueDay={formData.dayOfDie}
                onChangeDay={(value: number | undefined) => {
                  handle_setFormData("dayOfDie", value);
                }}
                valueMonth={formData.monthOfDie}
                onChangeMonth={(value: number | undefined) => {
                  handle_setFormData("monthOfDie", value);
                }}
                valueYear={formData.yearOfDie}
                onChangeYear={(value: number | undefined) => {
                  handle_setFormData("yearOfDie", value);
                }}
                onClear={() => {
                  setFormData((previousState) => {
                    return {
                      ...previousState,
                      dayOfDie: undefined,
                      monthOfDie: undefined,
                      yearOfDie: undefined,
                    };
                  });
                }}
              />
            </ColTcd>
            <ColTcd config={CommonConst.configColDefault}>
              <FormGroupInputTcd
                label="Nơi chôn cất"
                name="burialGround"
                id={`${formId}burialGround`}
                readOnly={formMode === FormModeEnum.detail}
                inputType={InputTypeEnum.text}
                value={formData.burialGround}
                error={formError.burialGround}
                onChange={(e: InputChangeModel) => {
                  handle_setFormData("burialGround", e.value);
                }}
              />
            </ColTcd>
          </RowTcd>
        )}
      </CardTcd>
    );
  }

  function thongTinTongQuanComponent() {
    return (
      <CardTcd
        title="Thông tin tổng quan"
        isOpen={dataShow.thongTinTongQuan}
        isCanCollapse={true}
        onChangeOpen={(isOpen) => {
          handle_setDataShow("thongTinTongQuan", isOpen);
        }}
      >
        <RowTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Điện thoại"
              name="phone"
              readOnly={formMode === FormModeEnum.detail}
              inputType={InputTypeEnum.text}
              id={`${formId}phone`}
              value={formData.phone}
              error={formError.phone}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("phone", e.value);
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
              label="Nơi sinh"
              name="homeTown"
              id={`${formId}homeTown`}
              readOnly={formMode === FormModeEnum.detail}
              inputType={InputTypeEnum.text}
              value={formData.homeTown}
              error={formError.homeTown}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("homeTown", e.value);
              }}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Nơi ở hiện tại"
              name="currentAddress"
              id={`${formId}currentAddress`}
              readOnly={formMode === FormModeEnum.detail}
              inputType={InputTypeEnum.text}
              value={formData.currentAddress}
              error={formError.currentAddress}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("currentAddress", e.value);
              }}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Nghề nghiệp"
              name="career"
              id={`${formId}career`}
              readOnly={formMode === FormModeEnum.detail}
              inputType={InputTypeEnum.text}
              value={formData.career}
              error={formError.career}
              onChange={(e: InputChangeModel) => {
                handle_setFormData("career", e.value);
              }}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Thứ tự (VD: 1 - con thứ 1)"
              name="ordinal"
              id={`${formId}ordinal`}
              infoContent="Phân biệt con cái/vợ chồng thứ mấy trong gia đình"
              readOnly={formMode === FormModeEnum.detail}
              inputType={InputTypeEnum.number}
              value={formData.ordinal}
              error={formError.ordinal}
              onChange={(e) => {
                handle_setFormData("ordinal", e.value);
              }}
            />
          </ColTcd>
        </RowTcd>
      </CardTcd>
    );
  }

  function thongTinHinhAnhComponent() {
    return (
      <CardTcd
        title="Thông tin hình ảnh"
        isOpen={dataShow.thongTinHinhAnh}
        isCanCollapse={true}
        onChangeOpen={(isOpen) => {
          handle_setDataShow("thongTinHinhAnh", isOpen);
        }}
      >
        <RowTcd>
          <ColTcd config={{ xs: { size: 12 }, md: { size: 6 } }}>
            <UpLoadTcd
              disabled={formMode === FormModeEnum.detail}
              onChange={(e: InputChangeModel) => {
                e.event.target.files.length > 0 &&
                  MemberService.UploadImage(e.event.target.files[0]).then(
                    (res) => {
                      if (res.isSuccess) {
                        useToastState.showToast(
                          NotifyTypeEnum.success,
                          "Tải lên ảnh thành công"
                        );
                        setFormData({
                          ...formData,
                          urlAvatar: res.data,
                        });
                      }
                    }
                  );
              }}
            ></UpLoadTcd>
            <FormGroupInputTcd
              label="Đường dẫn ảnh đại diện"
              name="urlAvatar"
              readOnly={formMode === FormModeEnum.detail}
              inputType={InputTypeEnum.text}
              id={`${formId}urlAvatar`}
              value={formData.urlAvatar}
              error={formError.urlAvatar}
              onChange={(e: InputChangeModel) => {
                setFormData({
                  ...formData,
                  urlAvatar: e.value,
                });
                handleValidateInput("urlAvatar", e.value);
              }}
            />
          </ColTcd>
          <ColTcd config={{ xs: { size: 12 }, md: { size: 6 } }}>
            <ImageTcd
              src={CommonHelper.getAbsolutePath(formData.urlAvatar)}
              preview
              alt="Ảnh đại diện"
              height={"100"}
            ></ImageTcd>
          </ColTcd>
        </RowTcd>
      </CardTcd>
    );
  }

  function thongTinThanhVienComponent() {
    return (
      <>
        {formMode !== FormModeEnum.add && (
          <ListMemberInFamilyCpn
            data={listMemberInFamily}
            isOpen={dataShow.thanhVienTrongGiaDinh}
            onChangeOpen={(isOpen) => {
              handle_setDataShow("thanhVienTrongGiaDinh", isOpen);
            }}
          ></ListMemberInFamilyCpn>
        )}
      </>
    );
  }

  function thongTinKhacComponent() {
    return (
      <CardTcd
        title="Thông tin khác"
        isOpen={dataShow.thongTinKhac}
        isCanCollapse={true}
        onChangeOpen={(isOpen) => {
          handle_setDataShow("thongTinKhac", isOpen);
        }}
      >
        <RowTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Người thêm"
              name="userInsert"
              readOnly={true}
              inputType={InputTypeEnum.text}
              value={formData.userInsert}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="TG thêm"
              name="userInsert"
              readOnly={true}
              inputType={InputTypeEnum.text}
              value={DateTimeHelper.getDateTimeString(formData.insertTime)}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Người cập nhật"
              name="userUpdate"
              readOnly={true}
              inputType={InputTypeEnum.text}
              value={formData.userUpdate}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="TG cập nhật"
              name="userUpdate"
              readOnly={true}
              inputType={InputTypeEnum.text}
              value={DateTimeHelper.getDateTimeString(formData.updateTime)}
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
    <ContentTcd
      isLoading={loadingData.form}
      isShowButtonExit={props.isShowButtonExit}
      isSticky={props.isSticky}
      title={
        <>
          {formMode === FormModeEnum.add && "Thêm mới "}
          {formMode === FormModeEnum.detail && "Chi tiết "}
          {formMode === FormModeEnum.edit && "Chỉnh sửa "}
          thành viên
        </>
      }
      onExit={props.onExit}
    >
      {toolbarComponent()}

      {thongTinCaNhanComponent()}

      {thongTinTongQuanComponent()}

      {thongTinHinhAnhComponent()}

      {thongTinThanhVienComponent()}

      {thongTinKhacComponent()}
    </ContentTcd>
  );
  //#endregion
}

//#region private functions
function OptionInputDateCpn(props: any) {
  const formId = useCommonHelper().useGenerateFormId();
  const myValue = props.value !== false;

  return (
    <div className="flex align-items-center gap-2">
      <RadioButtonTcd
        name={`${formId}datetext`}
        id={`${formId}${props.labelDate}`}
        value={myValue === true}
        label={props.labelDate}
        readOnly={props.readOnly}
        onChange={() => {
          props.onChange?.(true);
        }}
      ></RadioButtonTcd>
      <RadioButtonTcd
        name={`${formId}datetext`}
        id={`${formId}${props.labelYear}`}
        value={myValue !== true}
        label={props.labelYear}
        readOnly={props.readOnly}
        onChange={() => {
          props.onChange?.(false);
        }}
      ></RadioButtonTcd>
    </div>
  );
}

interface ListMemberInFamilyCpnModel {
  data?: MemberFamilyModel[];
  isOpen?: boolean;
  onChangeOpen?: (isOpen?: boolean) => void;
}
function ListMemberInFamilyCpn(props: Readonly<ListMemberInFamilyCpnModel>) {
  const tableRef = useRef<TableRefTcd<MemberAndUserModel>>(null);
  const columnConfig = useMemo<TableColumnTcdModel<MemberFamilyModel>[]>(
    () => [
      { field: "fullName", header: "Họ tên", width: 300 },
      { field: "dateOfBirthText", header: "Ngày sinh", width: 200 },
      { field: "relationship", header: "Mối quan hệ", width: 200 },
    ],
    []
  );

  return (
    <CardTcd
      title="Thành viên trong gia đình"
      isOpen={props.isOpen}
      isCanCollapse={true}
      onChangeOpen={props.onChangeOpen}
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
