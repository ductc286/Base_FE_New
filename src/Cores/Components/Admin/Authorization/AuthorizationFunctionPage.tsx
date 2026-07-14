//#region import

import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

import PermissionSearchListModal from "@src/Cores/Components/ShareComponents/SearchLists/PermissionSearchListModal";
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
  AuthorizationReferenceViewModel,
  CoreAuthorizationReferenceEntity,
  CorePermissionFilter,
} from "@src/Cores/Services/Admin/CoreAuthorizationReferenceService";
import { CoreRoleEntity } from "@src/Cores/Services/Admin/CoreRoleService";
import { CancelTokenModel } from "@src/Cores/Services/CancelTokenService";
import {
  ButtonTcd,
  CardTcd,
  ContainerTcd,
  ContentTcd,
  FormGroupInputTcd,
  MesageTcd,
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

export default function AuthorizationFunctionPage() {
  //#region Constants
  const tableRef = useRef<TableRefTcd<AuthorizationReferenceViewModel>>(null);
  const router = useRouter();
  const useCommonHelperState = useCommonHelper();
  const formId = useCommonHelperState.useGenerateFormId();
  const useToastState = useToast();
  const useConfirmModalState = useConfirmModal();

  const filterTypeOptions: SelectDataModel[] = [
    { value: "coreFeatureName", label: "Tính năng" },
    { value: "coreFunctionName", label: "Phạm vi" },
    { value: "coreActionName", label: "Hành động" },
  ];
  const filterProperties: PropertyModel[] =
    CommonConst.filterPropertiesDefault.concat([
      {
        name: "searchColumn",
        type: DataTypeEnum.string,
        valueDefault: "coreFeatureName",
      },
    ]);
  const selectedProperties: PropertyModel[] = [
    {
      name: "selectedRoleId",
      type: DataTypeEnum.string,
    },
  ];
  const columnConfig = useMemo<
    TableColumnTcdModel<AuthorizationReferenceViewModel>[]
  >(
    () => [
      {
        type: ColumnTypeTcdEnum.ordinal,
        pinType: "left",
      },
      {
        type: ColumnTypeTcdEnum.checkbox,
      },
      {
        header: "Tính năng",
        field: "coreFeatureName",
        sortable: true,
      },
      {
        header: "Phạm vi",
        field: "coreFunctionName",
      },
      {
        header: "Hành động",
        field: "coreActionName",
      },
      {
        header: "TG thêm vào vai trò",
        field: "insertTime",
        sortable: true,
        width: 100,
        render: (
          param: ColumnRenderParamTcd<AuthorizationReferenceViewModel>
        ) => DateTimeHelper.getDateTimeString(param.rowData.insertTime),
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
  const filterDefault: CorePermissionFilter =
    CommonHelper.getModelValue(filterProperties);

  const [filter, setFilter] = useState<CorePermissionFilter>({
    ...filterDefault,
  });

  const [pagination, setPagination] = useState<PaginationModel | undefined>(
    CommonConst.paginationDefault
  );
  const [authorizeAction, setAuthorizeAction] =
    useState<AuthorizeActionDefineModel>({});
  const [listData, setListData] = useState<AuthorizationReferenceViewModel[]>();
  const [formProps, setFormProps] = useState<FormPropsDataModel<string[]>>({
    formMode: FormModeEnum.unknown,
  });
  const [isDataChange, setIsDataChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isFilterChange, setIsFilterChange] = useState<boolean>(false);
  const [isOpenFilter, setIsOpenFilter] = useState<boolean | undefined>();

  const [listSelectRole, setListSelectRole] = useState<SelectDataModel[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | undefined>();
  const [keySelecteds, setKeySelecteds] = useState<string[] | undefined>();
  const [ignoreIds, setIgnoreIds] = useState<string[] | undefined>();
  const [loadingData, setLoadingData] = useState<ObjectBooleanModel>({
    addList: false,
    deleteList: false,
  });
  const isAllowEdit = useMemo(() => {
    if (
      !authorizeAction.edit ||
      !selectedRoleId ||
      CommonHelper.isNullOrEmpty(listSelectRole)
    ) {
      return false;
    }
    const foundSelectedRole = listSelectRole.find(
      (x) => x.value === selectedRoleId
    );
    const foundRoleTemp = foundSelectedRole?.modelValue as CoreRoleEntity;
    return foundRoleTemp?.isAdmin !== true;
  }, [authorizeAction, selectedRoleId, listSelectRole]);

  const isSelectedRoleAdmin = useMemo(() => {
    const foundSelectedRole = listSelectRole.find(
      (x) => x.value === selectedRoleId
    );
    const foundRoleTemp = foundSelectedRole?.modelValue as CoreRoleEntity;
    return foundRoleTemp?.isAdmin === true;
  }, [selectedRoleId, listSelectRole]);
  const totalRecordsSelected = useMemo<number>(
    () => keySelecteds?.length ?? 0,
    [keySelecteds]
  );
  //#endregion

  //#region useEffects
  useEffect(() => {
    if (!router.isReady) return;

    function handleInitList() {
      const filterFromQuery =
        useCommonHelperState.getFilterByUrl<CorePermissionFilter>(
          filterProperties
        );
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
  function initData(filterParam?: CorePermissionFilter, coreRoleId?: string) {
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
      FeatureCodeCommonConst.authorizationFunction
    ).then((res) => {
      if (res.isSuccess) {
        setAuthorizeAction(res.data?.authorizeAction ?? {});
      }
    });

    setSelectedRoleId(coreRoleId);
  }

  function handleGetList(
    filterParam?: CorePermissionFilter,
    isReplaceUrl: boolean | undefined = true,
    coreRoleIdParam?: string
  ) {
    coreRoleIdParam ??= selectedRoleId;
    if (!coreRoleIdParam) {
      // useToastState.showToast(NotifyTypeEnum.warning, "Bạn cần chọn vai trò");
      return;
    }
    const filterToSave = filterParam ?? filter;
    if (isFilterChange) {
      filterToSave.pageIndex = 1;
    }
    let filterRequest: CorePermissionFilter = {
      ...filterToSave,
      searchColumn: undefined,
      searchKeyword: undefined,
    };
    CommonHelper.trySetValue(
      filterRequest,
      filterToSave.searchColumn,
      filterToSave.searchKeyword
    );
    CommonHelper.trimModel(filterRequest, [
      "coreFeatureName",
      "coreFunctionName",
      "coreActionName",
    ]);
    setFilter(filterToSave);
    CancelTokenService.abort(cancelGetListRef.current);
    cancelGetListRef.current = CancelTokenService.generateInstance();

    setIsLoading(true);
    CoreAuthorizationReferenceService.GetListPermissionByRole(
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
          setIsLoading(false);
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
    dataParams?: AuthorizationReferenceViewModel[],
    keySelectedsParams?: string[]
  ) {
    if (!dataParams) {
      setKeySelecteds([]);
      return;
    }
    keySelectedsParams ??= keySelecteds;
    const selectedsTemp = keySelectedsParams?.filter((x) =>
      dataParams.some((y) => y.referenceId === x)
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
    const filterTemp: CorePermissionFilter = {
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
    const filteTemp: CorePermissionFilter = {
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
      .filter((x) => keySelecteds.includes(x.referenceId!))
      .map((x): CoreAuthorizationReferenceEntity => {
        return {
          coreRoleId: selectedRoleId,
          referenceId: x.referenceId,
          coreAthorizationReferenceId: x.coreAthorizationReferenceId,
        };
      });

    useConfirmModalState.confirm({
      message: "Bạn có chắc muốn xóa danh sách đã chọn",
      onOk: () => {
        handle_setLoadingData("deleteList", true);
        CoreAuthorizationReferenceService.DeleteListPermission(
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

    const requestData = selectedIdParams.map(
      (x): CoreAuthorizationReferenceEntity => {
        return {
          coreRoleId: selectedRoleId,
          referenceId: x,
        };
      }
    );

    handle_setLoadingData("addList", true);
    CoreAuthorizationReferenceService.AddListPermission(
      selectedRoleId,
      requestData
    )
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
          title={"Phân quyền chức năng"}
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
              {isSelectedRoleAdmin && (
                <MesageTcd
                  text="Vai trò admin có tất cả các quyền, không được phép chỉnh sửa"
                  type={NotifyTypeEnum.info}
                ></MesageTcd>
              )}
            </ToolbarTcd.Left>
          </ToolbarTcd.Container>

          <CardTcd
            title={"Danh sách quyền trong vai trò"}
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

            <TableTcd<AuthorizationReferenceViewModel>
              columnConfigs={columnConfig}
              data={listData}
              sortConfig={{ orderBy: filter.orderBy, isDesc: filter.isDesc }}
              height={CommonConst.table.heightDefault}
              isLoading={isLoading}
              columnKey="referenceId"
              keySelecteds={keySelecteds}
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
      <PermissionSearchListModal
        formProps={formProps}
        isLoading={loadingData.addList}
        onSave={handleAdd}
        onDataChange={() => setIsDataChange(true)}
        onExit={() => {
          if (isDataChange) {
            handleGetList();
          }
        }}
      ></PermissionSearchListModal>
    </>
  );
  //#endregion
}
