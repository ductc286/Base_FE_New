//#region imports
import dynamic from "next/dynamic";
import { Image } from "primereact/image";
import { OrganizationChart } from "primereact/organizationchart";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import FamilyTreeFormCpn, {
  DataExtendModel,
} from "@src/AppForders/Components/FamilyTree/FamilyTreeFormCpn";
import MemberService, {
  MemberAndUserModel,
  MemberFilterModel,
} from "@src/AppForders/Services/MemberService";
import { CommonConst } from "@src/Cores/Constants";
import {
  FormModeEnum,
  InputTypeEnum,
  NotifyTypeEnum,
  SizeEnum,
} from "@src/Cores/Enums/CommonEnum";
import { CommonHelper, HtmlHelper } from "@src/Cores/Helpers";
import { useCommonHelper, useToast } from "@src/Cores/Hooks";
import { FormPropsDataModel } from "@src/Cores/Models/CommonModels";
import { AppAuthenticationService } from "@src/Cores/Services";
import {
  ButtonHideFilterTcd,
  ButtonTcd,
  CardTcd,
  CheckboxTcd,
  ColTcd,
  ContainerTcd,
  ContentTcd,
  DivFilterTcd,
  FormGroupInputTcd,
  ModalTcd,
  PopoverOptionTcd,
  RowTcd,
  SelectTcd,
  ToolbarTcd,
  TooltipTcd,
} from "@src/Cores/ShareComponents";
import CollapseTcd from "@src/Cores/ShareComponents/CollapseTcd";
import { SelectDataModel } from "@src/Cores/Types/SelectDataModel";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

//#endregion

export default function HomePage() {
  //#region constants
  const useCommonHelperState = useCommonHelper();
  const formId = useCommonHelperState.useGenerateFormId();
  const useToastState = useToast();
  const filterDefault: ObjectModel = {
    pageIndex: 1,
    pageSize: CommonConst.table.pageSizeAll,
    isRelativeSearch: true,
  };
  const dataPrintDefault = {
    title: `<p style="text-align: center;"><span style="color: rgb(33, 37, 41); font-size: 24px;"><span style="font-family: &quot;times new roman&quot;, times, serif;"><strong>Gia phả họ Nguyễn</strong></span></span></p>`,
  };
  //#endregion

  //#region states
  const componentRef = useRef<HTMLDivElement>(null);

  const [filter, setFilter] = useState<MemberFilterModel>({ ...filterDefault });
  const [listData, setListData] = useState<MemberAndUserModel[]>([]);
  const [listSelectMember, setListSelectMember] = useState<SelectDataModel[]>(
    []
  );
  const [authorizeAction, setAuthorizeAction] = useState<ObjectModel>({});
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenModalPrintSetting, setIsOpenModalPrintSetting] =
    useState<boolean>(false);
  const [isDataChange, setIsDataChange] = useState<boolean>(false);
  const [isOpenFilter, setIsOpenFilter] = useState<boolean | undefined>(false);
  const [formSetting, setFormSetting] = useState<ObjectModel>({
    isCloseFilterAfterApply: true,
    isModePrint: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataPrintSetting, setDataPrintSetting] =
    useState<ObjectModel>(dataPrintDefault);
  const [dataPrint, setDataPrint] = useState<ObjectModel>(dataPrintDefault);
  const [settingTransform, setSettingTransform] = useState("");
  const [settingScale, setSettingScale] = useState(1);
  const [isLoadingTree, setIsLoadingTree] = useState<boolean>(false);
  const [isLoadingAddRoot, setIsLoadingAddRoot] = useState<boolean>(false);
  const [isEmptyFamilyTree, setIsEmptyFamilyTree] = useState<boolean>(false);
  //#region form
  const [formProps, setFormProps] = useState<
    FormPropsDataModel<DataExtendModel>
  >({
    formMode: FormModeEnum.unknown,
  });
  //#endregion

  //#endregion

  //#region useEffect
  useEffect(() => {
    fun_getList();
    fun_getListSelectMember();
    AppAuthenticationService.GetAuthorizeAction("member").then((res) => {
      if (res.isSuccess) {
        setAuthorizeAction(res.data?.authorizeAction ?? {});
      }
    });
    MemberService.CheckEmptyFamilyTree().then((res) => {
      if (res.isSuccess) {
        setIsEmptyFamilyTree(res.data ?? false);
      }
    });
  }, []);
  //#endregion

  //#region functions
  function fun_getList(filterParam?: ObjectModel) {
    setIsLoadingTree(true);
    filterParam ??= filter;
    MemberService.GetListTree(filterParam)
      .then((res) => {
        if (res.isSuccess) {
          const var_data = CommonHelper.cloneList(res.data ?? []);
          fun_getListOrg(var_data);
          setListData(var_data ?? []);
          setIsDataChange(false);
        }
      })
      .finally(() => {
        setIsLoadingTree(false);
      });
  }

  function fun_callGetList(filterParam?: ObjectModel) {
    fun_getList();
  }

  function fun_getListSelectMember() {
    const filter = {
      isInternal: true,
    };
    MemberService.GetListSelect(filter).then((res) => {
      setListSelectMember(res);
    });
  }

  function fun_getListOrg(listMember: any) {
    if (CommonHelper.isNull(listMember)) {
      return;
    }
    listMember.forEach((element: any) => {
      element.expanded = true;
      element.children = element.listChild;
      fun_getListOrg(element.children);
    });
  }

  function fun_roleChange(e: any) {
    const var_filter = { ...filter, fromMemberId: e.value };
    fun_getList(var_filter);
    setFilter(var_filter);
  }

  function fun_toggle(par_isDataChange?: boolean) {
    if (isOpenModal && (isDataChange || par_isDataChange)) {
      fun_getList();
    }
    setIsOpenModal(!isOpenModal);
  }

  function fun_getUrlAvatar(par_node: any) {
    if (par_node.urlAvatar) {
      return CommonHelper.getAbsolutePath(par_node.urlAvatar);
    }
    if (par_node.sexCode === "male") {
      return CommonHelper.getAbsolutePath("/images/static/boy-icon.jpg");
    }
    if (par_node.sexCode === "female") {
      return CommonHelper.getAbsolutePath("/images/static/girl-icon.png");
    }
    return CommonHelper.getAbsolutePath("/images/static/unknown-user.png");
  }

  function fun_DetailMember(par_item: any) {
    fun_toggle();
    setFormProps({
      formMode: FormModeEnum.detail,
      stateId: CommonHelper.generateFormStateId(),
      recordId: par_item.memberId,
    });
  }

  function fun_AddMember(par_item: any) {
    fun_toggle();
    setFormProps({
      formMode: FormModeEnum.add,
      stateId: CommonHelper.generateFormStateId(),
      recordId: undefined,
      dataExtend: {
        relationId: par_item.memberId,
        relationName: par_item.fullName,
      },
    });
  }

  function fun_GotoMember(par_item: any) {
    const var_filter = { ...filter, fromMemberId: par_item.memberId };
    fun_getList(var_filter);
    setFilter(var_filter);
  }

  function fun_onExit(isDataChange?: boolean) {
    fun_toggle(isDataChange);
  }

  const nodeTemplate = (node: any) => {
    return (
      <div className="familyTree-card">
        <div className="familyTree-cardMain flex flex-col items-center gap-1">
          <div className="flex justify-content-center">
            <Image
              src={fun_getUrlAvatar(node)}
              alt="Avatar"
              height={"100"}
              imageClassName="familyTree-avatar"
            ></Image>
          </div>
          <div className="familyTree-name">{node.fullName}</div>
          <div className="flex justify-content-center gap-3">
            <ButtonTcd
              tooltip="Xem thông tin thành viên"
              color={CommonConst.classColor.secondary}
              icon={CommonConst.classIcon.view}
              isNoBackground
              size={SizeEnum.small}
              onClick={() => {
                fun_DetailMember(node);
              }}
            ></ButtonTcd>
            {authorizeAction.add && (
              <ButtonTcd
                tooltip="Thêm thành viên"
                color={CommonConst.classColor.secondary}
                icon={CommonConst.classIcon.add}
                size={SizeEnum.small}
                isNoBackground
                onClick={() => {
                  fun_AddMember(node);
                }}
              ></ButtonTcd>
            )}
            <ButtonTcd
              tooltip="Chuyển lên đầu nhánh"
              color={CommonConst.classColor.secondary}
              icon="fas fa-level-up-alt"
              size={SizeEnum.small}
              isNoBackground
              onClick={() => {
                fun_GotoMember(node);
              }}
            ></ButtonTcd>
          </div>
          <i style={{ fontSize: "12px" }}>(Đời {node.levelItem})</i>
        </div>
        {node.listSpouse?.map((item: any, i: number) => (
          <div
            className="familyTree-cardPlus flex flex-col items-center gap-1"
            key={i}
          >
            <div className="flex justify-content-center">
              <Image
                src={fun_getUrlAvatar(item)}
                alt="Ảnh đại diện"
                height={"100"}
                imageClassName="familyTree-avatar"
              ></Image>
            </div>
            <div className="familyTree-name">{item.fullName}</div>
            <div>
              <ButtonTcd
                className="m-1 familyTree-button"
                tooltip="Xem thông tin thành viên"
                color={CommonConst.classColor.secondary}
                icon={CommonConst.classIcon.view}
                size={SizeEnum.small}
                isNoBackground
                isIconMode
                onClick={() => {
                  fun_DetailMember(item);
                }}
              ></ButtonTcd>
            </div>
            <i style={{ fontSize: "12px" }}>(Đời {node.levelItem})</i>
          </div>
        ))}
      </div>
    );
  };

  const nodeTemplate_ModePrint = (node: any) => {
    return (
      <div className="familyTree-card">
        <div className="align-items-center familyTree-cardMain">
          <div className="familyTree-name">{node.fullName}</div>
          <i style={{ fontSize: "12px" }}>(Đời {node.levelItem})</i>
        </div>
        {node.listSpouse?.map((item: any, i: number) => (
          <div className="familyTree-cardPlus" key={i}>
            <div className="familyTree-name">{item.fullName}</div>
            <i style={{ fontSize: "12px" }}>(Đời {node.levelItem})</i>
          </div>
        ))}
      </div>
    );
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  function fun_resetFilter() {
    setFilter({ ...filterDefault });
  }

  const handleExportPdf = () => {
    const filterTemp = CommonHelper.cloneObject(filter);
    filterTemp.listMemberId = getMemberIds();
    setIsLoading(true);
    MemberService.ExportPdf(filterTemp)
      .then((res) => {
        if (res.isSuccess) {
          const base64String = res.data;
          const linkSource = "data:application/pdf;base64," + base64String;
          const downloadLink = document.createElement("a");
          const fileName = "convertedPDFFile.pdf";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getIdsFromListData = (input: any) => {
    const result: string[] = [];
    if (input) {
      input.forEach((element: any) => {
        result.push(element.memberId);
        //lặp ds vợ chồng lấy id
        if (element?.listSpouse) {
          element.listSpouse.forEach((spouseItem: any) => {
            result.push(spouseItem.memberId);
          });
        }
        //lặp ds con cái lấy id
        if (element?.listChild) {
          element.listChild.forEach((childItem: any) => {
            result.push(childItem.memberId);

            //lặp ds vợ chồng của con cái lấy id
            if (childItem?.listSpouse) {
              childItem.listSpouse.forEach((spouseItem: any) => {
                result.push(spouseItem.memberId);
              });
            }

            const listChildTemp = getIdsFromListData(childItem.listChild);
            result.push(...listChildTemp);
          });
        }
      });
    }
    return result;
  };

  const getMemberIds = () => {
    return getIdsFromListData([...listData]);
  };

  const editorConfig = useMemo<any>(() => {
    return CommonConst.editorConfig;
  }, []);

  function fun_set_Filter(
    property: string,
    value: any,
    isRefreshList?: boolean
  ) {
    const var_filter = { ...filter, [property]: value };
    setFilter(var_filter);

    if (isRefreshList) {
      fun_getList(var_filter);
    }
  }

  function addFamilyRoot() {
    setIsLoadingAddRoot(true);
    MemberService.AddRoot()
      .then((res) => {
        if (res.isSuccess) {
          setIsEmptyFamilyTree(false);
          useToastState.showToast(NotifyTypeEnum.success, res.message);
          fun_getList();
        }
      })
      .finally(() => {
        setIsLoadingAddRoot(false);
      });
  }
  //#endregion

  //#region private components
  const orgFamilyComponents = useMemo(() => {
    return (
      <CardTcd>
        {(!listData || listData.length < 1) && (
          <div className="pt-3">
            Không có thành viên hoặc không tìm thấy dữ liệu phù hợp
            {isEmptyFamilyTree && (
              <div>
                <ButtonTcd
                  text="Tạo cây gia phả"
                  isLoading={isLoadingAddRoot}
                  onClick={addFamilyRoot}
                ></ButtonTcd>
              </div>
            )}
          </div>
        )}
        {listData?.length > 0 && (
          <div className="card pt-3 scroll-x-tcd">
            {!formSetting.isModePrint && (
              <div style={{ transform: settingTransform }}>
                <OrganizationChart
                  value={listData as any}
                  nodeTemplate={
                    formSetting.isModePrint
                      ? nodeTemplate_ModePrint
                      : nodeTemplate
                  }
                />
              </div>
            )}
            <div
              style={{
                display: formSetting.isModePrint ? "block" : "none",
              }}
            >
              <div ref={componentRef}>
                <div
                  className="familyTree-print-main"
                  style={{
                    transform: settingTransform,
                    padding: "10px",
                    width: "100%",
                    transformOrigin: "center",
                  }}
                >
                  <div style={{ width: "auto", margin: "5px 0" }}>
                    {HtmlHelper.parseHtml(dataPrint.title)}
                  </div>
                  <OrganizationChart
                    value={listData as any}
                    nodeTemplate={nodeTemplate_ModePrint}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardTcd>
    );
  }, [listData, formSetting.isModePrint, settingScale, dataPrint?.title]);

  function filterComponent() {
    return (
      <ToolbarTcd.Container>
        <ToolbarTcd.Left>
          <label className={CommonConst.className.toolbarItem}>
            Cây gia phả của thành viên
          </label>
          <div className="w-80">
            <SelectTcd
              filter
              showClear
              options={listSelectMember}
              onChange={fun_roleChange}
              value={filter.fromMemberId}
            />
          </div>
          <ButtonTcd
            text="Làm mới"
            className={CommonConst.className.toolbarItem}
            icon={CommonConst.classIcon.refresh}
            color={CommonConst.classColor.primary}
            onClick={fun_callGetList}
          ></ButtonTcd>
          <ButtonHideFilterTcd
            color={CommonConst.classColor.primary}
            isOpen={isOpenFilter}
            onClick={() => setIsOpenFilter(!isOpenFilter)}
          />

          <PopoverOptionTcd
            listItem={[
              {
                label: "Chế độ in",
                icon: formSetting.isModePrint
                  ? CommonConst.classIcon.checked
                  : CommonConst.classIcon.unCheck,
                onclick: () => {
                  setFormSetting({
                    ...formSetting,
                    isModePrint: !formSetting.isModePrint,
                  });
                },
              },
              {
                label: "In sơ đồ",
                icon: CommonConst.classIcon.print,
                onclick: () => {
                  handlePrint();
                },
              },
              {
                label: "Xuất pdf",
                icon: CommonConst.classIcon.filePdf,
                onclick: () => {
                  handleExportPdf();
                },
              },
              {
                label: "Cấu hình in sơ đồ gia phả",
                icon: CommonConst.classIcon.tool,
                onclick: () => {
                  setIsOpenModalPrintSetting(true);
                },
              },
            ]}
          >
            <ButtonTcd
              text="Tiện ích"
              className={CommonConst.className.toolbarItem}
              icon={CommonConst.classIcon.util}
              color={CommonConst.classColor.primary}
            ></ButtonTcd>
          </PopoverOptionTcd>
          <TooltipTcd title={"Thu nhỏ"}>
            <ButtonTcd
              className={CommonConst.className.toolbarItem}
              icon={CommonConst.classIcon.zoomOut}
              color={CommonConst.classColor.primary}
              onClick={() => {
                const dataTemp = settingScale - 0.1;
                if (dataTemp > 1 || dataTemp < 0.5) {
                  return;
                }
                setSettingScale(dataTemp);
                setSettingTransform(`scale(${dataTemp})`);
              }}
            ></ButtonTcd>
          </TooltipTcd>
          <TooltipTcd title={"Phóng to"}>
            <ButtonTcd
              className={CommonConst.className.toolbarItem}
              icon={CommonConst.classIcon.zoomIn}
              color={CommonConst.classColor.primary}
              onClick={() => {
                const dataTemp = settingScale + 0.1;
                if (dataTemp > 1 || dataTemp < 0.5) {
                  return;
                }
                setSettingScale(dataTemp);
                setSettingTransform(`scale(${dataTemp})`);
              }}
            ></ButtonTcd>
          </TooltipTcd>
          <TooltipTcd title={"Chuyển tới đời trên của thành viên"}>
            <ButtonTcd
              className={CommonConst.className.toolbarItem}
              icon={CommonConst.classIcon.up}
              color={CommonConst.classColor.primary}
              onClick={() => {
                if (listData?.length > 0) {
                  const rootTree = listData[0];
                  fun_set_Filter("fromMemberId", rootTree?.parentId, true);
                }
              }}
            ></ButtonTcd>
          </TooltipTcd>
        </ToolbarTcd.Left>
      </ToolbarTcd.Container>
    );
  }

  function filterExtendComponent() {
    return (
      <CollapseTcd isOpen={isOpenFilter}>
        <DivFilterTcd
          onApply={fun_callGetList}
          onHideFilter={() => setIsOpenFilter(false)}
          onReset={fun_resetFilter}
        >
          <RowTcd>
            <ColTcd config={CommonConst.configColDefault}>
              <FormGroupInputTcd
                label="Ẩn thành viên"
                name="listMemberHide"
                inputType={InputTypeEnum.select}
                id={`${formId}listMemberHide`}
                value={filter.listMemberHide}
                isMultiple={true}
                filter
                showClear
                options={listSelectMember}
                onChange={(e: any) => {
                  fun_set_Filter("listMemberHide", e.value);
                }}
              />
            </ColTcd>
          </RowTcd>
          <RowTcd>
            <ColTcd config={CommonConst.configColDefault}>
              <CheckboxTcd
                value={filter.isHideSpouse}
                onChange={(e: any) => {
                  setFilter({ ...filter, isHideSpouse: e.value });
                }}
                label="Ẩn vợ/chồng"
              ></CheckboxTcd>
            </ColTcd>
          </RowTcd>
        </DivFilterTcd>
      </CollapseTcd>
    );
  }
  //#endregion

  //#region main return
  return (
    <>
      <ContainerTcd size={SizeEnum.large}>
        <ContentTcd
          title={"Sơ đồ gia phả"}
          isLoading={isLoading || isLoadingTree}
        >
          {filterComponent()}
          {filterExtendComponent()}
          {orgFamilyComponents}
        </ContentTcd>
      </ContainerTcd>

      <ModalTcd isOpen={isOpenModal} onExit={() => fun_toggle()}>
        <FamilyTreeFormCpn
          formProps={formProps}
          onExit={fun_onExit}
          onDataChange={() => setIsDataChange(true)}
          isShowButtonExit={true}
          isSticky={true}
          // dataExtend={dataExtend}
        ></FamilyTreeFormCpn>
      </ModalTcd>

      <ModalTcd
        isOpen={isOpenModalPrintSetting}
        onExit={() => setIsOpenModalPrintSetting(!isOpenModalPrintSetting)}
      >
        <ContentTcd title={"Cấu hình in sơ đồ gia phả"}>
          <ToolbarTcd.Container>
            <ToolbarTcd.Left>
              <ButtonTcd
                text="Áp dụng"
                className={CommonConst.className.toolbarItem}
                icon={CommonConst.classIcon.check}
                color={CommonConst.classColor.success}
                onClick={() => {
                  setDataPrint({ ...dataPrintSetting });
                  setIsOpenModalPrintSetting(false);
                  useToastState.showToast(
                    NotifyTypeEnum.success,
                    "Áp dụng cấu hình thành công"
                  );
                }}
              ></ButtonTcd>
              <ButtonTcd
                text="Cài lại"
                className={CommonConst.className.toolbarItem}
                icon={CommonConst.classIcon.reset}
                color={CommonConst.classColor.primary}
                onClick={() => {
                  setDataPrintSetting({ ...dataPrintDefault });
                }}
              ></ButtonTcd>
            </ToolbarTcd.Left>
          </ToolbarTcd.Container>
          <CardTcd title={"Tiêu đề sơ đồ"} isShowIconOpen={false}>
            <JoditEditor
              config={editorConfig}
              value={dataPrintSetting.title || ""} //Phải cho chuỗi trống thay vì null thì nó mới update trên giao diện value mới
              onBlur={(newContent: any) => {
                setDataPrintSetting((prevState) => ({
                  ...prevState,
                  title: newContent,
                }));
              }}
            />
          </CardTcd>
        </ContentTcd>
      </ModalTcd>
    </>
  );
  //#endregion
}
