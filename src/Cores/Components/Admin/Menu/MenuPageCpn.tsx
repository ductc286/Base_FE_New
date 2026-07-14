//#region import
import { useEffect, useMemo, useRef, useState } from "react";

import { CommonConst } from "@src/Cores/Constants";
import FeatureCodeCommonConst from "@src/Cores/Constants/FeatureCodeCommonConst";
import { DataTypeEnum, FormModeEnum } from "@src/Cores/Enums/CommonEnum";
import { CommonHelper, DateTimeHelper } from "@src/Cores/Helpers";
import { useCommonHelper } from "@src/Cores/Hooks";
import {
  AuthorizeActionDefineModel,
  FormPropsModel,
  PaginationModel,
  PropertyModel,
} from "@src/Cores/Models/CommonModels";
import {
  AppAuthenticationService,
  CancelTokenService,
  CoreMenuService,
} from "@src/Cores/Services";
import {
  CoreMenuEntity,
  CoreMenuFilter,
} from "@src/Cores/Services/Admin/CoreMenuService";
import { CancelTokenModel } from "@src/Cores/Services/CancelTokenService";
import {
  ContentTcd,
  PaginationTcd,
  TableTcd,
  TableViewDetailTcd,
  ToolbarFilterTcd,
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

export default function MenuPageCpn(props: Readonly<FormPropsModel<unknown>>) {
  //#region Constants
  const myPathName = "/admin/menu";
  const useCommonHelperState = useCommonHelper();
  const tableRef = useRef<TableRefTcd<CoreMenuEntity>>(null);
  const filterTypeOptions: SelectDataModel[] = [
    { value: "code", label: "Mã" },
    { value: "name", label: "Tên" },
  ];
  const filterProperties: PropertyModel[] =
    CommonConst.filterPropertiesDefault.concat([
      {
        name: "searchColumn",
        type: DataTypeEnum.string,
        valueDefault: "name",
      },
    ]);
  const columnConfig = useMemo<TableColumnTcdModel<CoreMenuEntity>[]>(
    () => [
      {
        type: ColumnTypeTcdEnum.ordinal,
        pinType: "left",
      },
      {
        width: 60,
        type: ColumnTypeTcdEnum.action,
        render: (param: ColumnRenderParamTcd<CoreMenuEntity>) => {
          return (
            <TableViewDetailTcd
              href={`${myPathName}/detail/${param.rowData.coreMenuId}`}
              onClick={() => detailClick(param.rowData)}
            ></TableViewDetailTcd>
          );
        },
      },
      {
        header: "Mã",
        field: "code",
        width: 100,
      },
      {
        header: "Tên",
        field: "name",
        minWidth: 100,
      },
      {
        header: "Url",
        field: "urlPath",
        width: 200,
      },
      {
        header: "Thứ tự",
        field: "ordinal",
        width: 100,
      },
      {
        header: "TG tạo",
        field: "insertTime",
        width: 100,
        render: (param: ColumnRenderParamTcd<CoreMenuEntity>) =>
          DateTimeHelper.getDateTimeString(param.rowData.insertTime),
      },
    ],
    []
  );
  //#endregion

  //#region states
  const cancelGetListRef = useRef<CancelTokenModel>(undefined);
  const filterDefault: CoreMenuFilter =
    CommonHelper.getModelValue(filterProperties);

  const [filter, setFilter] = useState<CoreMenuFilter>({
    ...filterDefault,
  });

  const [pagination, setPagination] = useState<PaginationModel | undefined>(
    CommonConst.paginationDefault
  );
  const [authorizeAction, setAuthorizeAction] =
    useState<AuthorizeActionDefineModel>({});
  const [listData, setListData] = useState<CoreMenuEntity[]>();
  const [isLoading, setIsLoading] = useState(false);

  const [isFilterChange, setIsFilterChange] = useState<boolean>(false);
  const [isOpenFilter, setIsOpenFilter] = useState<boolean | undefined>();
  const sortConfig: SortTableConfigModel = useMemo(() => {
    return {
      orderBy: filter.orderBy,
      isDesc: filter.isDesc,
    };
  }, [filter.orderBy, filter.isDesc]);
  //#endregion

  //#region useEffects
  useEffect(() => {
    if (props.formProps.stateId) {
      const filterFromQuery =
        useCommonHelperState.getFilterByUrl<CoreMenuFilter>(filterProperties);
      setPagination({ ...CommonConst.paginationDefault });
      handleGetList(filterFromQuery);
    }
  }, [props.formProps.stateId]);

  useEffect(() => {
    initData();
    return () => {
      CancelTokenService.abort(cancelGetListRef.current);
    };
  }, []);
  //#endregion

  //#region functions
  function initData() {
    AppAuthenticationService.GetAuthorizeAction(
      FeatureCodeCommonConst.coreMenu
    ).then((res) => {
      if (res.isSuccess) {
        setAuthorizeAction(res.data?.authorizeAction ?? {});
      }
    });
  }

  function handleGetList(filterParam?: CoreMenuFilter) {
    const filterToSave = filterParam ?? filter;
    if (isFilterChange) {
      filterToSave.pageIndex = 1;
    }
    let filterRequest: CoreMenuFilter = {
      ...filterToSave,
      searchColumn: undefined,
      searchKeyword: undefined,
    };
    CommonHelper.trySetValue(
      filterRequest,
      filterToSave.searchColumn,
      filterToSave.searchKeyword
    );
    CommonHelper.trimModel(filterRequest, ["name", "code"]);
    setFilter(filterToSave);
    setIsLoading(true);
    CancelTokenService.abort(cancelGetListRef.current);
    cancelGetListRef.current = CancelTokenService.generateInstance();

    CoreMenuService.GetList(filterRequest, cancelGetListRef.current)
      .then((res) => {
        if (res.isSuccess) {
          setListData(res.data);
          setPagination(res.pagination);
        }
      })
      .finally(() => {
        setIsLoading(false);
        setIsFilterChange(false);
      });

    const url = useCommonHelperState.getUrlByFilter(
      filterProperties,
      filterToSave
    );
    props.onChangeUrl?.(url);
  }

  function detailClick(record: CoreMenuEntity) {
    props.onFormModeChange?.({
      formMode: FormModeEnum.detail,
      stateId: CommonHelper.generateFormStateId(),
      recordId: record.coreMenuId,
    });
  }

  function addClick() {
    props.onFormModeChange?.({
      formMode: FormModeEnum.add,
      stateId: CommonHelper.generateFormStateId(),
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
    const filterTemp: CoreMenuFilter = {
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
    const filteTemp: CoreMenuFilter = {
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

  //#endregion

  //#region main return
  return (
    <ContentTcd title={"Danh sách menu"}>
      <ToolbarFilterTcd
        searchKeyword={filter.searchKeyword}
        searchColumn={filter.searchColumn}
        filterTypeOptions={filterTypeOptions}
        isOpen={isOpenFilter}
        isShowButtonAdd={authorizeAction.add}
        onResetFilter={handleResetFilter}
        onSearch={handleSearch}
        onOpenChange={setIsOpenFilter}
        onFilterChange={handleFilterChange}
        onAddClick={addClick}
      ></ToolbarFilterTcd>
      <TableTcd<CoreMenuEntity>
        columnConfigs={columnConfig}
        data={listData}
        sortConfig={sortConfig}
        height={CommonConst.table.heightDefault}
        isLoading={isLoading}
        ref={tableRef}
        columnKey="coreMenuId"
        onSortChange={handleTableSortChange}
      ></TableTcd>

      <PaginationTcd
        pagination={pagination}
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        isOffUrlParam={CommonConst.isOffUrlParam}
        isShowTableSetting={true}
        tableApi={tableRef.current}
        onChange={handlePaginationChange}
      ></PaginationTcd>
    </ContentTcd>
  );
  //#endregion
}
