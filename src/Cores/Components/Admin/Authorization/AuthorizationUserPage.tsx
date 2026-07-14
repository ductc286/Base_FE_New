//#region import

import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

import UserSearchListModal from "@src/Cores/Components/ShareComponents/SearchLists/UserSearchListModal";
import { CommonConst } from "@src/Cores/Constants";
import FeatureCodeCommonConst from "@src/Cores/Constants/FeatureCodeCommonConst";
import {
  DataTypeEnum,
  FormInputLayoutTypeEnum,
  FormModeEnum,
  InputTypeEnum,
  NotifyTypeEnum,
  PageModeEnum,
} from "@src/Cores/Enums/CommonEnum";
import { CommonHelper, DateTimeHelper } from "@src/Cores/Helpers";
import { useCommonHelper, useConfirmModal, useToast } from "@src/Cores/Hooks";
import {
  AuthorizeActionDefineModel,
  CodeResponseEnum,
  FormPropsDataModel,
  InputChangeModel,
  PaginationModel,
  PropertyModel,
} from "@src/Cores/Models/CommonModels";
import {
  AppAuthenticationService,
  CancelTokenService,
  CoreAuthorizationReferenceService,
  CoreRoleService,
} from "@src/Cores/Services";
import {
  CoreRole_CoreUserEntity,
  CoreRoleUserModel,
} from "@src/Cores/Services/Admin/CoreRoleService";
import { CoreUserFilter } from "@src/Cores/Services/Admin/CoreUserService";
import { CancelTokenModel } from "@src/Cores/Services/CancelTokenService";
import {
  ButtonTcd,
  CardTcd,
  ContainerTcd,
  ContentTcd,
  FormGroupInputTcd,
  PaginationTcd,
  TableTcd,
  TableToolbarTcd,
  ToolbarFilterTcd,
  ToolbarTcd,
} from "@src/Cores/ShareComponents";
import {
  ColumnRenderParamTcd,
  ColumnTypeTcdEnum,
  SortTableConfigModel,
  TableColumnTcdModel,
  TableRefTcd,
} from "@src/Cores/ShareComponents/Table/TableCommon";
import { SelectDataModel } from "@src/Cores/Types/SelectDataModel";

//#endregion

//#region models
interface PostPageRoleModel {
  selectedRoleId?: string;
}
//#endregion

export default function AuthorizationUserPage() {
  //#region Constants
  const router = useRouter();
  const useCommonHelperState = useCommonHelper();
  const formId = useCommonHelperState.useGenerateFormId();
  const useToastState = useToast();
  const useConfirmModalState = useConfirmModal();
  const tableRef = useRef<TableRefTcd<CoreRoleUserModel>>(null);
  const filterTypeOptions: SelectDataModel[] = [
    { value: "userName", label: "Mã" },
    { value: "fullName", label: "Tên" },
  ];
  const filterProperties: PropertyModel[] =
    CommonConst.filterPropertiesDefault.concat([
      {
        name: "searchColumn",
        type: DataTypeEnum.string,
        valueDefault: "fullName",
      },
    ]);
  const selectedProperties: PropertyModel[] = [
    {
      name: "selectedRoleId",
      type: DataTypeEnum.string,
    },
  ];
  const columnConfig: TableColumnTcdModel<CoreRoleUserModel>[] = useMemo(
    () => [
      {
        type: ColumnTypeTcdEnum.checkbox,
      },
      {
        type: ColumnTypeTcdEnum.ordinal,
      },
      {
        header: "Mã",
        field: "userName",
        sortable: true,
      },
      {
        header: "Tên",
        field: "fullName",
        sortable: true,
      },
      {
        header: "TG thêm vào vai trò",
        field: "insertTime",
        sortable: true,
        width: "100px",
        render: (param: ColumnRenderParamTcd<CoreRoleUserModel>) =>
          DateTimeHelper.getDateString(param.rowData.insertTime),
      },
    ],
    []
  );
  //#endregion

  //#region states
  const isInitDataRef = useRef(false);
  const isInitWhenRouterChange = useRef(true);
  const cancelGetListRef = useRef<CancelTokenModel>(undefined);
  const [tabActive, setTabActive] = useState(PageModeEnum.loading);
  const filterDefault: CoreUserFilter =
    CommonHelper.getModelValue(filterProperties);

  const [filter, setFilter] = useState<CoreUserFilter>({
    ...filterDefault,
  });

  const [pagination, setPagination] = useState<PaginationModel | undefined>(
    CommonConst.paginationDefault
  );
  const [authorizeAction, setAuthorizeAction] =
    useState<AuthorizeActionDefineModel>({});
  const [listData, setListData] = useState<CoreRoleUserModel[]>();
  const [formProps, setFormProps] = useState<FormPropsDataModel<string[]>>({
    formMode: FormModeEnum.unknown,
  });
  const [isDataChange, setIsDataChange] = useState(false);

  const [isFilterChange, setIsFilterChange] = useState<boolean>(false);
  const [isOpenFilter, setIsOpenFilter] = useState<boolean | undefined>();
  const [listSelectRole, setListSelectRole] = useState<SelectDataModel[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | undefined>();
  const [keySelecteds, setKeySelecteds] = useState<string[] | undefined>();
  const [ignoreIds, setIgnoreIds] = useState<string[] | undefined>();
  const totalRecordsSelected = keySelecteds?.length ?? 0;
  const [loadingData, setLoadingData] = useState<ObjectBooleanModel>({
    addList: false,
    deleteList: false,
    list: false,
  });
  const isAllowEdit = useMemo(() => {
    if (
      !authorizeAction.edit ||
      !selectedRoleId ||
      CommonHelper.isNullOrEmpty(listSelectRole)
    ) {
      return false;
    }
    return true;
  }, [authorizeAction, selectedRoleId, listSelectRole]);
  const sortConfig: SortTableConfigModel = useMemo(() => {
    return {
      orderBy: filter.orderBy,
      isDesc: filter.isDesc,
    };
  }, [filter.orderBy, filter.isDesc]);
  //#endregion

  //#region useEffects
  useEffect(() => {
    if (!router.isReady) return;

    function handleInitList() {
      const filterFromQuery =
        useCommonHelperState.getFilterByUrl<CoreUserFilter>(filterProperties);
      const roleSelectedModel =
        useCommonHelperState.getFilterByUrl<PostPageRoleModel>(
          selectedProperties
        );
      setPagination({ ...CommonConst.paginationDefault });
      initData(filterFromQuery, roleSelectedModel?.selectedRoleId);
    }

    function promiseInit() {
      return new Promise(function (resolve) {
        handleInitList();
        resolve("ok");
      });
    }

    //Xử lý pathname cũ

    if (isInitWhenRouterChange.current) {
      isInitWhenRouterChange.current = false;
      promiseInit().finally(() => {
        isInitWhenRouterChange.current = true;
      });
    } else {
      isInitWhenRouterChange.current = true;
    }
  }, [router.asPath]);

  useEffect(() => {
    return () => {
      CancelTokenService.abort(cancelGetListRef.current);
    };
  }, []);
  //#endregion

  //#region functions
  function initData(filterParam?: CoreUserFilter, coreRoleId?: string) {
    isInitDataRef.current = true;
    if (coreRoleId) {
      handleGetList(filterParam, false, coreRoleId);
    } else {
      setFilter(filterParam ?? {});
    }

    CoreRoleService.GetListSelect().then((res) => {
      setListSelectRole(res);
    });

    AppAuthenticationService.GetAuthorizeAction(
      FeatureCodeCommonConst.authorizationUser
    ).then((res) => {
      if (res.isSuccess) {
        setAuthorizeAction(res.data?.authorizeAction ?? {});
      }
    });

    setSelectedRoleId(coreRoleId);
  }

  function handleGetList(
    filterParam?: CoreUserFilter,
    isReplaceUrl: boolean | undefined = true,
    coreRoleIdParam?: string
  ) {
    coreRoleIdParam ??= selectedRoleId;
    if (!coreRoleIdParam) {
      useToastState.showToast(NotifyTypeEnum.warning, "Bạn cần chọn vai trò");
      return;
    }
    const filterToSave = filterParam ?? filter;
    if (isFilterChange) {
      filterToSave.pageIndex = 1;
    }
    let filterRequest: CoreUserFilter = {
      ...filterToSave,
      searchColumn: undefined,
      searchKeyword: undefined,
    };
    CommonHelper.trySetValue(
      filterRequest,
      filterToSave.searchColumn,
      filterToSave.searchKeyword
    );
    CommonHelper.trimModel(filterRequest, ["userName", "fullName"]);
    setFilter(filterToSave);
    CancelTokenService.abort(cancelGetListRef.current);
    cancelGetListRef.current = CancelTokenService.generateInstance();

    handle_setLoadingData("list", true);
    CoreAuthorizationReferenceService.GetListUserByRole(
      coreRoleIdParam,
      filterRequest,
      cancelGetListRef.current
    )
      .then((res) => {
        if (res.isSuccess) {
          setListData(res.data);
          setPagination(res.pagination);
          setIgnoreIds(res.listAllIds);
          refreshSelected(res.data);
          setIsDataChange(false);
        }
        if (res.statusCode !== CodeResponseEnum.CancellationToken) {
          handle_setLoadingData("list", false);
        }
      })
      .finally(() => {
        setIsFilterChange(false);
      });

    if (!CommonConst.isOffUrlParam && isReplaceUrl !== false) {
      const queryFilter = useCommonHelperState.getQueryByModel(
        filterProperties,
        filterToSave
      );
      const querySelected = useCommonHelperState.getQueryByModel(
        selectedProperties,
        { selectedRoleId: coreRoleIdParam }
      );
      const urlTemp = useCommonHelperState.getUrlByQuery(
        queryFilter.concat(querySelected)
      );
      handleReplaceUrlList(urlTemp);
    }
  }

  function handleReplaceUrlList(url: string) {
    isInitWhenRouterChange.current = false;
    if (tabActive !== PageModeEnum.list) {
      setTabActive(PageModeEnum.list);
    }
    router.push(url);
  }

  function refreshSelected(
    dataParams?: CoreRoleUserModel[],
    keySelectedsParams?: string[]
  ) {
    if (!dataParams) {
      setKeySelecteds([]);
      return;
    }
    keySelectedsParams ??= keySelecteds;
    const selectedsTemp = keySelectedsParams?.filter((x) =>
      dataParams.some((y) => y.coreUserId === x)
    );
    setKeySelecteds(selectedsTemp);
  }

  function handle_setLoadingData(propertyName: string, value?: boolean) {
    setLoadingData((prevState) => {
      return { ...prevState, [propertyName]: value };
    });
  }

  function addClick() {
    if (!selectedRoleId) {
      useToastState.showToast(NotifyTypeEnum.warning, "Bạn cần chọn vai trò");
      return;
    }
    setFormProps({
      formMode: FormModeEnum.list,
      stateId: CommonHelper.generateFormStateId(),
      ignoreIds: ignoreIds,
    });
  }

  function handlePaginationChange(pageIndex: number, pageSize: number) {
    const filterVal = {
      ...filter,
      pageIndex: pageIndex,
      pageSize: pageSize,
    };
    handleGetList(filterVal);
  }

  function handleResetFilter() {
    handleGetList({ ...filterDefault });
  }

  function handleFilterChange(
    property: string,
    value?: any,
    isRefreshList?: boolean
  ) {
    const filterTemp: CoreUserFilter = {
      ...filter,
      [property]: value,
    };
    setFilter(filterTemp);
    setIsFilterChange(true);

    if (isRefreshList) {
      handleGetList({ ...filterTemp, pageIndex: 1 });
    }
  }

  function handleTableSortChange(sortConfig?: SortTableConfigModel) {
    const filteTemp: CoreUserFilter = {
      ...filter,
      orderBy: sortConfig?.orderBy,
      isDesc: sortConfig?.isDesc,
    };
    handleGetList(filteTemp);
  }

  function handleSearch() {
    if (isFilterChange) {
      handleGetList({ ...filter, pageIndex: 1 });
    } else {
      handleGetList();
    }
  }

  function deleteClick() {
    if (!selectedRoleId) {
      useToastState.showToast(NotifyTypeEnum.warning, "Bạn cần chọn vai trò");
      return;
    }
    if (totalRecordsSelected < 1 || !listData || !keySelecteds) {
      useToastState.showToast(
        NotifyTypeEnum.warning,
        "Chưa có bản ghi nào được chọn"
      );
      return;
    }
    const requestData = listData
      .filter((x) => keySelecteds.includes(x.coreUserId!))
      .map((x): CoreRole_CoreUserEntity => {
        return {
          coreRoleId: selectedRoleId,
          coreUserId: x.coreUserId,
        };
      });

    useConfirmModalState.confirm({
      message: "Bạn có chắc muốn xóa danh sách đã chọn",
      onOk: () => {
        handle_setLoadingData("deleteList", true);
        CoreAuthorizationReferenceService.DeleteListUser(
          selectedRoleId,
          requestData
        )
          .then((res) => {
            if (res.isSuccess) {
              useToastState.showToast(NotifyTypeEnum.success, res.message);
              handleGetList();
            }
          })
          .finally(() => {
            handle_setLoadingData("deleteList", false);
          });
      },
    });
  }

  function handleAdd(selectedIdParams?: string[]) {
    if (!selectedRoleId) {
      useToastState.showToast(NotifyTypeEnum.warning, "Bạn cần chọn vai trò");
      return;
    }
    if (!selectedIdParams || CommonHelper.isNullOrEmpty(selectedIdParams)) {
      useToastState.showToast(
        NotifyTypeEnum.warning,
        "Chưa có bản ghi nào được chọn"
      );
      return;
    }

    const requestData = selectedIdParams.map((x): CoreRole_CoreUserEntity => {
      return {
        coreRoleId: selectedRoleId,
        coreUserId: x,
      };
    });

    handle_setLoadingData("addList", true);
    CoreAuthorizationReferenceService.AddListUser(selectedRoleId, requestData)
      .then((res) => {
        if (res.isSuccess) {
          useToastState.showToast(NotifyTypeEnum.success, res.message);
          const ignoreIdsTemp = (ignoreIds ?? []).concat(selectedIdParams);
          setIgnoreIds(ignoreIdsTemp);
          setFormProps((prevState) => {
            return {
              ...prevState,
              stateId: CommonHelper.generateFormStateId(),
              ignoreIds: ignoreIdsTemp,
            };
          });
          setIsDataChange(true);
        }
      })
      .finally(() => {
        handle_setLoadingData("addList", false);
      });
  }
  //#endregion

  //#region main return
  return (
    <>
      <ContainerTcd>
        <ContentTcd
          title={"Phân quyền người dùng"}
          isLoading={loadingData.deleteList}
        >
          <ToolbarTcd.Container>
            <ToolbarTcd.Left>
              <div style={{ width: "100%", maxWidth: "550px" }}>
                <FormGroupInputTcd
                  label="Chọn vai trò"
                  name="selectedRoleId"
                  formLayout={FormInputLayoutTypeEnum.horizontal}
                  inputType={InputTypeEnum.select}
                  isShowRequired
                  id={`${formId}selectedRoleId`}
                  value={selectedRoleId}
                  options={listSelectRole}
                  onChange={(e: InputChangeModel) => {
                    setSelectedRoleId(e.value);
                    handleGetList(undefined, undefined, e.value);
                  }}
                />
              </div>
            </ToolbarTcd.Left>
          </ToolbarTcd.Container>

          <CardTcd
            title={"Danh sách người dùng trong vai trò"}
            isOpen={selectedRoleId !== undefined}
            isCanCollapse={true}
            isShowIconOpen={false}
          >
            <ToolbarFilterTcd
              searchKeyword={filter.searchKeyword}
              searchColumn={filter.searchColumn}
              filterTypeOptions={filterTypeOptions}
              isOpen={isOpenFilter}
              isShowButtonAdd={authorizeAction.add}
              isStyleInCard
              onResetFilter={handleResetFilter}
              onSearch={handleSearch}
              onOpenChange={setIsOpenFilter}
              onFilterChange={handleFilterChange}
              onAddClick={addClick}
            ></ToolbarFilterTcd>

            <TableToolbarTcd
              totalRecordsSelected={totalRecordsSelected}
              totalRecordsQuery={pagination?.totalRecordsReturn}
              isStyleInCard
              rightComponent={
                <>
                  {isAllowEdit && (
                    <>
                      <ButtonTcd
                        text="Xóa"
                        color={CommonConst.classColor.danger}
                        icon={CommonConst.classIcon.delete}
                        onClick={deleteClick}
                      ></ButtonTcd>
                      <ButtonTcd
                        text="Thêm"
                        color={CommonConst.classColor.primary}
                        icon={CommonConst.classIcon.add}
                        onClick={addClick}
                      ></ButtonTcd>
                    </>
                  )}
                </>
              }
            ></TableToolbarTcd>

            <TableTcd<CoreRoleUserModel>
              columnConfigs={columnConfig}
              data={listData}
              sortConfig={sortConfig}
              height={CommonConst.table.heightDefault}
              isLoading={loadingData.list}
              columnKey="coreUserId"
              onSelectChange={(param) => {
                setKeySelecteds(param.keyValues);
              }}
              onSortChange={handleTableSortChange}
              ref={tableRef}
            ></TableTcd>

            <PaginationTcd
              pagination={pagination}
              pageIndex={filter.pageIndex}
              pageSize={filter.pageSize}
              isOffUrlParam={CommonConst.isOffUrlParam}
              isStyleInCard
              onChange={handlePaginationChange}
              tableApi={tableRef.current}
            ></PaginationTcd>
          </CardTcd>
        </ContentTcd>
      </ContainerTcd>
      <UserSearchListModal
        formProps={formProps}
        isLoading={loadingData.addList}
        onSave={handleAdd}
        onDataChange={() => setIsDataChange(true)}
        onExit={() => {
          if (isDataChange) {
            handleGetList();
          }
        }}
      ></UserSearchListModal>
    </>
  );
  //#endregion
}
