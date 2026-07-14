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
import { CancelTokenService, CoreMenuService } from "@src/Cores/Services";
import {
  CoreMenuEntity,
  CoreMenuFilter,
} from "@src/Cores/Services/Admin/CoreMenuService";
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
} from "@src/Cores/ShareComponents/Table/TableCommon";
import { SelectDataModel } from "@src/Cores/Types/SelectDataModel";

//#endregion

export default function MenuSearchListModal(
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
      <MenuSearchListCpn {...props} onExit={handleExit}></MenuSearchListCpn>
    </ModalTcd>
  );
  //#endregion
}

export function MenuSearchListCpn(props: Readonly<FormPropsModel<string[]>>) {
  //#region Constants
  const filterTypeOptions: SelectDataModel[] = [
    { value: "code", label: "Mã" },
    { value: "name", label: "Tên" },
    { value: "urlPath", label: "Đường dẫn" },
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
        type: ColumnTypeTcdEnum.checkbox,
      },
      {
        type: ColumnTypeTcdEnum.ordinal,
      },
      {
        header: "Mã",
        field: "code",
        sortable: true,
      },
      {
        header: "Tên",
        field: "name",
        sortable: true,
      },
      {
        header: "Đường dẫn",
        field: "urlPath",
        sortable: true,
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
  const [listData, setListData] = useState<CoreMenuEntity[]>();
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
      handleGetList(undefined, []);
    }
  }, [props.formProps.stateId]);

  useEffect(() => {
    return () => {
      CancelTokenService.abort(cancelGetListRef.current);
    };
  }, []);
  //#endregion

  //#region functions

  function handleGetList(
    filterParam?: CoreMenuFilter,
    keySelectedsParams?: string[]
  ) {
    const filterToSave = filterParam ?? filter;
    filterToSave.ignoreIds = props.formProps.ignoreIds;
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
    CommonHelper.trimModel(filterRequest, ["code", "name", "urlPath"]);
    setFilter(filterToSave);
    CancelTokenService.abort(cancelGetListRef.current);
    cancelGetListRef.current = CancelTokenService.generateInstance();

    setIsLoading(true);
    CoreMenuService.GetListNeedAuthorization(
      filterRequest,
      cancelGetListRef.current
    )
      .then((res) => {
        if (res.isSuccess) {
          setListData(res.data);
          setPagination(res.pagination);
          refreshSelected(res.data, keySelectedsParams);
        }
      })
      .finally(() => {
        setIsLoading(false);
        setIsFilterChange(false);
      });
  }

  function refreshSelected(
    dataParams?: CoreMenuEntity[],
    keySelectedsParams?: string[]
  ) {
    if (!dataParams) {
      setKeySelecteds([]);
      return;
    }
    keySelectedsParams ??= keySelecteds;
    const temp = keySelectedsParams?.filter((x) =>
      dataParams.some((y) => y.coreMenuId === x)
    );
    setKeySelecteds(temp);
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
    <ContentTcd
      title={"Danh sách menu"}
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

      <TableTcd<CoreMenuEntity>
        columnConfigs={columnConfig}
        data={listData}
        sortConfig={sortConfig}
        height={CommonConst.table.heightDefault}
        isLoading={isLoading}
        columnKey="coreMenuId"
        keySelecteds={keySelecteds}
        onSelectChange={(param) => {
          setKeySelecteds(param.keyValues as string[]);
        }}
        onSortChange={handleTableSortChange}
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
