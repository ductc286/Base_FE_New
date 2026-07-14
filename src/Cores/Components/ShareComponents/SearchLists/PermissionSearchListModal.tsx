//#region import
import { useEffect, useMemo, useRef, useState } from "react";

import { CommonConst } from "@src/Cores/Constants";
import { DataTypeEnum } from "@src/Cores/Enums/CommonEnum";
import { CommonHelper } from "@src/Cores/Helpers";
import {
  FormPropsModel,
  PaginationModel,
  PropertyModel,
} from "@src/Cores/Models/CommonModels";
import { CancelTokenService, CorePermissionService } from "@src/Cores/Services";
import {
  CorePermissionEntity,
  CorePermissionFilter,
} from "@src/Cores/Services/Admin/CoreAuthorizationReferenceService";
import { CancelTokenModel } from "@src/Cores/Services/CancelTokenService";
import {
  ButtonTcd,
  ContentTcd,
  ModalTcd,
  PaginationTcd,
  TableTcd,
  TableToolbarTcd,
  ToolbarFilterTcd,
} from "@src/Cores/ShareComponents";
import {
  ColumnTypeTcdEnum,
  SortTableConfigModel,
  TableColumnTcdModel,
  TableRefTcd,
} from "@src/Cores/ShareComponents/Table/TableCommon";
import { SelectDataModel } from "@src/Cores/Types/SelectDataModel";

//#endregion

export default function PermissionSearchListModal(
  props: Readonly<FormPropsModel<string[]>>
) {
  //#region Constants
  //#endregion

  //#region states
  const [isOpen, setIsOpen] = useState(false);
  //#endregion

  //#region useEffects
  useEffect(() => {
    if (props.formProps.stateId) {
      setIsOpen(true);
    }
  }, [props.formProps.stateId]);

  useEffect(() => {
    return () => {
      setIsOpen(false);
    };
  }, []);
  //#endregion

  //#region functions
  function handleExit() {
    setIsOpen(false);
    props.onExit?.();
  }
  //#endregion

  //#region main return
  return (
    <ModalTcd isOpen={isOpen} onExit={handleExit}>
      <PermissionSearchListCpn
        {...props}
        onExit={handleExit}
      ></PermissionSearchListCpn>
    </ModalTcd>
  );
  //#endregion
}

export function PermissionSearchListCpn(
  props: Readonly<FormPropsModel<string[]>>
) {
  //#region Constants
  const tableRef = useRef<TableRefTcd<CorePermissionEntity>>(null);
  const filterTypeOptions: SelectDataModel[] = [
    { value: "coreFeatureName", label: "Tính năng" },
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
  const columnConfig = useMemo<TableColumnTcdModel<CorePermissionEntity>[]>(
    () => [
      {
        type: ColumnTypeTcdEnum.checkbox,
      },
      {
        type: ColumnTypeTcdEnum.ordinal,
      },
      {
        header: "Tính năng",
        field: "coreFeatureName",
      },
      {
        header: "Phạm vi",
        field: "coreFunctionName",
      },
      {
        header: "Hành động",
        field: "coreActionName",
      },
    ],
    []
  );
  //#endregion

  //#region states
  const cancelGetListRef = useRef<CancelTokenModel>(undefined);
  const filterDefault: CorePermissionFilter =
    CommonHelper.getModelValue(filterProperties);

  const [filter, setFilter] = useState<CorePermissionFilter>({
    ...filterDefault,
  });

  const [pagination, setPagination] = useState<PaginationModel | undefined>(
    CommonConst.paginationDefault
  );
  const [listData, setListData] = useState<CorePermissionEntity[]>();
  const [isLoading, setIsLoading] = useState(false);

  const [isFilterChange, setIsFilterChange] = useState<boolean>(false);
  const [isOpenFilter, setIsOpenFilter] = useState<boolean | undefined>();
  const [keySelecteds, setKeySelecteds] = useState<string[] | undefined>();
  const sortConfig = useMemo<SortTableConfigModel>(() => {
    return {
      orderBy: filter.orderBy,
      isDesc: filter.isDesc,
    };
  }, [filter.orderBy, filter.isDesc]);
  const totalRecordsSelected = useMemo<number>(
    () => keySelecteds?.length ?? 0,
    [keySelecteds]
  );
  //#endregion

  //#region useEffects
  useEffect(() => {
    if (props.formProps.stateId) {
      handleGetList();
    }
  }, [props.formProps.stateId]);

  useEffect(() => {
    return () => {
      CancelTokenService.abort(cancelGetListRef.current);
    };
  }, []);
  //#endregion

  //#region functions

  function handleGetList(filterParam?: CorePermissionFilter) {
    const filterToSave = filterParam ?? filter;
    filterToSave.ignoreIds = props.formProps.ignoreIds;
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
      "coreActionName",
    ]);
    setFilter(filterToSave);
    CancelTokenService.abort(cancelGetListRef.current);
    cancelGetListRef.current = CancelTokenService.generateInstance();

    setIsLoading(true);
    CorePermissionService.GetListView(filterRequest, cancelGetListRef.current)
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
    setFilter({ ...filterDefault });
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

  //#endregion

  //#region main return
  return (
    <ContentTcd
      title={"Danh sách chức năng"}
      isSticky
      isShowButtonExit
      onExit={props.onExit}
    >
      <ToolbarFilterTcd
        searchKeyword={filter.searchKeyword}
        searchColumn={filter.searchColumn}
        filterTypeOptions={filterTypeOptions}
        isOpen={isOpenFilter}
        rightComponent={
          <ButtonTcd
            text="Lưu lại"
            color={CommonConst.classColor.success}
            icon={CommonConst.classIcon.save}
            isLoading={props.isLoading}
            onClick={() => {
              props.onSave?.(keySelecteds);
            }}
          ></ButtonTcd>
        }
        onResetFilter={handleResetFilter}
        onSearch={handleSearch}
        onOpenChange={setIsOpenFilter}
        onFilterChange={handleFilterChange}
      ></ToolbarFilterTcd>

      <TableToolbarTcd
        totalRecordsSelected={totalRecordsSelected}
      ></TableToolbarTcd>

      <TableTcd<CorePermissionEntity>
        columnConfigs={columnConfig}
        data={listData}
        sortConfig={sortConfig}
        height={CommonConst.table.heightDefault}
        isLoading={isLoading}
        columnKey="corePermissionId"
        keySelecteds={keySelecteds}
        onSelectChange={(param) => {
          setKeySelecteds(param.keyValues as string[]);
        }}
        onSortChange={handleTableSortChange}
        ref={tableRef}
      ></TableTcd>

      <PaginationTcd
        pagination={pagination}
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        isOffUrlParam
        onChange={handlePaginationChange}
      ></PaginationTcd>
    </ContentTcd>
  );
  //#endregion
}
