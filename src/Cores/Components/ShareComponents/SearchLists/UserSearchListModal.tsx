//#region import
import { useEffect, useMemo, useRef, useState } from "react";

import { CommonConst } from "@src/Cores/Constants";
import { DataTypeEnum } from "@src/Cores/Enums/CommonEnum";
import { CommonHelper, DateTimeHelper } from "@src/Cores/Helpers";
import {
  FormPropsModel,
  PaginationModel,
  PropertyModel,
} from "@src/Cores/Models/CommonModels";
import { CancelTokenService, CoreUserService } from "@src/Cores/Services";
import {
  CoreUserEntity,
  CoreUserFilter,
} from "@src/Cores/Services/Admin/CoreUserService";
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
  ColumnRenderParamTcd,
  ColumnTypeTcdEnum,
  SortTableConfigModel,
  TableColumnTcdModel,
  TableRefTcd,
} from "@src/Cores/ShareComponents/Table/TableCommon";
import { SelectDataModel } from "@src/Cores/Types/SelectDataModel";

//#endregion

export default function UserSearchListModal(
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
      <UserSearchListCpn {...props} onExit={handleExit}></UserSearchListCpn>
    </ModalTcd>
  );
  //#endregion
}

export function UserSearchListCpn(props: Readonly<FormPropsModel<string[]>>) {
  //#region Constants
  const tableRef = useRef<TableRefTcd<CoreUserEntity>>(null);
  const filterTypeOptions: SelectDataModel[] = [
    { value: "userName", label: "Tài khoản" },
    { value: "fullName", label: "Họ tên" },
  ];
  const filterProperties: PropertyModel[] =
    CommonConst.filterPropertiesDefault.concat([
      {
        name: "searchColumn",
        type: DataTypeEnum.string,
        valueDefault: "fullName",
      },
    ]);
  const columnConfig = useMemo<TableColumnTcdModel<CoreUserEntity>[]>(() => {
    return [
      {
        type: ColumnTypeTcdEnum.checkbox,
      },
      {
        type: ColumnTypeTcdEnum.ordinal,
      },
      {
        header: "Tài khoản",
        field: "userName",
        sortable: true,
        width: "50px",
      },
      {
        header: "Họ tên",
        field: "fullName",
        sortable: true,
      },
      {
        header: "Ngày sinh",
        field: "dateOfBirth",
        width: "100px",
        sortable: true,
        render: (param: ColumnRenderParamTcd<CoreUserEntity>) =>
          DateTimeHelper.getDateString(param.rowData.dateOfBirth),
      },
      {
        header: "TG tạo",
        field: "insertTime",
        sortable: true,
        width: "220px",
        render: (param: ColumnRenderParamTcd<CoreUserEntity>) =>
          DateTimeHelper.getDateString(param.rowData.insertTime),
      },
    ];
  }, []);
  //#endregion

  //#region states
  const cancelGetListRef = useRef<CancelTokenModel>(undefined);
  const filterDefault: CoreUserFilter =
    CommonHelper.getModelValue(filterProperties);

  const [filter, setFilter] = useState<CoreUserFilter>({
    ...filterDefault,
  });

  const [pagination, setPagination] = useState<PaginationModel | undefined>(
    CommonConst.paginationDefault
  );
  const [listData, setListData] = useState<CoreUserEntity[]>();
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
    filterParam?: CoreUserFilter,
    keySelectedsParams?: string[]
  ) {
    const filterToSave = filterParam ?? filter;
    filterToSave.ignoreIds = props.formProps.ignoreIds;
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
    CommonHelper.trimModel(filterRequest, ["fullName", "userName"]);
    setFilter(filterToSave);
    CancelTokenService.abort(cancelGetListRef.current);
    cancelGetListRef.current = CancelTokenService.generateInstance();

    setIsLoading(true);
    CoreUserService.GetListView(filterRequest, cancelGetListRef.current)
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
    dataParams?: CoreUserEntity[],
    keySelectedsParams?: string[]
  ) {
    if (!dataParams) {
      setKeySelecteds([]);
      return;
    }
    keySelectedsParams ??= keySelecteds;
    const temp = keySelectedsParams?.filter((x) =>
      dataParams.some((y) => y.coreUserId === x)
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

  //#endregion

  //#region main return
  return (
    <ContentTcd
      title={"Danh sách người dùng"}
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

      <TableTcd<CoreUserEntity>
        columnConfigs={columnConfig}
        data={listData}
        sortConfig={sortConfig}
        height={CommonConst.table.heightDefault}
        isLoading={isLoading}
        columnKey="coreUserId"
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
        tableApi={tableRef.current}
      ></PaginationTcd>
    </ContentTcd>
  );
  //#endregion
}
