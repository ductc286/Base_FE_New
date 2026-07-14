//#region import
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";

import { CommonConst } from "@src/Cores/Constants";
import FeatureCodeCommonConst from "@src/Cores/Constants/FeatureCodeCommonConst";
import { DataTypeEnum, FormModeEnum } from "@src/Cores/Enums/CommonEnum";
import { CommonHelper, DateTimeHelper } from "@src/Cores/Helpers";
import { useCommonHelper } from "@src/Cores/Hooks";
import { useGlobalData } from "@src/Cores/Hooks/useGlobalData";
import {
  FormPropsModel,
  PageStateModel,
  PropertyModel,
} from "@src/Cores/Models/CommonModels";
import {
  CancelTokenService,
  CorePostCategoryService,
} from "@src/Cores/Services";
import {
  CorePostCategoryEntity,
  CorePostCategoryFilter,
} from "@src/Cores/Services/Admin/Post/CorePostCategoryService";
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

export default function PostCategoryPageCpn(
  props: Readonly<FormPropsModel<unknown>>
) {
  //#region Constants
  const myPathName = "/admin/post-category";
  const tableId = "post-category_manage";
  const useCommonHelperState = useCommonHelper();
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
  //#endregion

  //#region states
  const cancelGetListRef = useRef<CancelTokenModel>(undefined);
  const filterDefault: CorePostCategoryFilter =
    CommonHelper.getModelValue(filterProperties);

  const conlumnConfigsDefault = [
    {
      type: ColumnTypeTcdEnum.ordinal,
      pinType: "left",
      colKey: ColumnTypeTcdEnum[ColumnTypeTcdEnum.ordinal],
    },
    {
      width: 60,
      type: ColumnTypeTcdEnum.action,
      render: (param: ColumnRenderParamTcd<CorePostCategoryEntity>) => {
        return (
          <TableViewDetailTcd
            href={`${myPathName}/detail/${param.rowData.corePostCategoryId}`}
            onClick={() => detailClick(param.rowData)}
          ></TableViewDetailTcd>
        );
      },
      colKey: ColumnTypeTcdEnum[ColumnTypeTcdEnum.action],
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
      header: "Ghi chú",
      field: "note",
      width: 200,
    },
    {
      header: "TG tạo",
      field: "insertTime",
      width: 100,
      render: (param: ColumnRenderParamTcd<CorePostCategoryEntity>) =>
        DateTimeHelper.getDateTimeString(param.rowData.insertTime),
    },
  ] as TableColumnTcdModel<CorePostCategoryEntity>[];
  const formmState = useForm<PageStateModel<CorePostCategoryEntity>>({
    defaultValues: {
      isLoading: false,
      isFilterChange: false,
      isOpenFilter: false,
      pagination: CommonConst.paginationDefault,
      columnConfig: conlumnConfigsDefault,
    },
  });

  const formFilter = useForm({
    defaultValues: {
      filterSearch: { ...filterDefault },
      filterUI: { ...filterDefault },
    },
  });

  const filter = formFilter.watch("filterSearch");
  const authorizeAction = useGlobalData().getAuthorizeAction(
    FeatureCodeCommonConst.coreRole
  );
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
        useCommonHelperState.getFilterByUrl<CorePostCategoryFilter>(
          filterProperties
        );
      formmState.setValue("pagination", { ...CommonConst.paginationDefault });
      handleGetList(filterFromQuery, true);
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
  function initData() {}

  function handleGetList(
    filterParam?: CorePostCategoryFilter,
    isNotChangeUrl?: boolean
  ) {
    const filterToSave = filterParam ?? filter;
    let filterRequest: CorePostCategoryFilter = {
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
    formFilter.setValue("filterSearch", filterToSave);
    formFilter.setValue("filterUI", filterToSave);
    formmState.setValue("isLoading", true);
    CancelTokenService.abort(cancelGetListRef.current);
    cancelGetListRef.current = CancelTokenService.generateInstance();

    CorePostCategoryService.GetList(filterRequest, cancelGetListRef.current)
      .then((res) => {
        if (res.isSuccess) {
          formmState.setValue("listdata", res.data);
          formmState.setValue("pagination", res.pagination);
        }
      })
      .finally(() => {
        formmState.setValue("isLoading", false);
        formmState.setValue("isFilterChange", false);
      });

    if (isNotChangeUrl !== true) {
      const queryFilter = useCommonHelperState.getQueryByModel(
        filterProperties,
        filterToSave
      );
      const urlTemp = useCommonHelperState.getUrlByQuery(queryFilter);
      props.onChangeUrl?.(urlTemp);
    }
  }

  function detailClick(record: CorePostCategoryEntity) {
    props.onFormModeChange?.({
      formMode: FormModeEnum.detail,
      stateId: CommonHelper.generateFormStateId(),
      recordId: record.corePostCategoryId,
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
    const filterTemp: CorePostCategoryFilter = {
      ...filter,
      [property]: value,
    };
    formFilter.setValue("filterSearch", { ...filterTemp, pageIndex: 1 });
    formFilter.setValue("filterUI", { ...filterTemp });
    formmState.setValue("isFilterChange", true);

    if (isRefreshList) {
      handleGetList({ ...filterTemp, pageIndex: 1 });
    }
  }

  function handleTableSortChange(sortConfig?: SortTableConfigModel) {
    const filteTemp: CorePostCategoryFilter = {
      ...filter,
      orderBy: sortConfig?.orderBy,
      isDesc: sortConfig?.isDesc,
    };
    handleGetList(filteTemp);
  }

  function handleSearch() {
    handleGetList();
  }

  const setColumnConfigs = (
    columnConfigs: TableColumnTcdModel<CorePostCategoryEntity>[]
  ) => {
    console.log("columnConfigs", columnConfigs);

    formmState.setValue("columnConfig", []);
    setTimeout(() => {
      formmState.setValue("columnConfig", columnConfigs);
    }, 50);
  };
  const tableRef: TableRefTcd<CorePostCategoryEntity> = {
    table: {
      setColumnConfigs,
      conlumnConfigsDefault,
      conlumnConfigs: formmState.watch("columnConfig"),

      sortConfig,
      tableId: tableId,
    },
  };
  //#endregion

  //#region main return
  return (
    <ContentTcd title={"Danh sách vai trò"}>
      <ToolbarFilterTcd
        searchKeyword={filter.searchKeyword}
        searchColumn={filter.searchColumn}
        filterTypeOptions={filterTypeOptions}
        isOpen={formmState.watch("isOpenFilter")}
        isShowButtonAdd={authorizeAction.add}
        onResetFilter={handleResetFilter}
        onSearch={handleSearch}
        onOpenChange={(isOpen) => {
          formmState.setValue("isOpenFilter", isOpen);
        }}
        onFilterChange={handleFilterChange}
        onAddClick={addClick}
      ></ToolbarFilterTcd>
      <TableTcd<CorePostCategoryEntity>
        columnConfigs={formmState.watch("columnConfig")}
        data={formmState.watch("listdata")}
        sortConfig={sortConfig}
        height={CommonConst.table.heightDefault}
        isLoading={formmState.watch("isLoading")}
        columnKey="corePostCategoryId"
        onSortChange={handleTableSortChange}
        onColReorder={(param) => {
          setColumnConfigs(param.data);
        }}
        reorderableColumns
      ></TableTcd>
      <PaginationTcd
        pagination={formmState.watch("pagination")}
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        isOffUrlParam={CommonConst.isOffUrlParam}
        isShowTableSetting={true}
        tableApi={tableRef}
        onChange={handlePaginationChange}
      ></PaginationTcd>
    </ContentTcd>
  );
  //#endregion
}
