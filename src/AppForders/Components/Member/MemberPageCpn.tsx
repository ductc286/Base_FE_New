//#region import
import { useEffect, useMemo, useRef, useState } from "react";

import MemberService, {
  MemberAndUserModel,
  MemberFilterModel,
} from "@src/AppForders/Services/MemberService";
import { CommonConst } from "@src/Cores/Constants";
import {
  DataTypeEnum,
  FormModeEnum,
  InputTypeEnum,
} from "@src/Cores/Enums/CommonEnum";
import { CommonHelper, DateTimeHelper } from "@src/Cores/Helpers";
import { useCommonHelper } from "@src/Cores/Hooks";
import {
  FormPropsModel,
  InputChangeModel,
  PaginationModel,
  PropertyModel,
} from "@src/Cores/Models/CommonModels";
import { CancelTokenService } from "@src/Cores/Services";
import { CancelTokenModel } from "@src/Cores/Services/CancelTokenService";
import {
  ColTcd,
  ContentTcd,
  FormGroupInputTcd,
  PaginationTcd,
  RowTcd,
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

export default function MemberPageCpn(
  props: Readonly<FormPropsModel<unknown>>
) {
  //#region Constants
  const myPathName = "/admin/menu";
  const useCommonHelperState = useCommonHelper();
  const formId = useCommonHelperState.useGenerateFormId();
  const tableRef = useRef<TableRefTcd<MemberAndUserModel>>(null);
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
      { name: "listMemberHide", type: DataTypeEnum.arrayString },
    ]);
  const columnConfig = useMemo<TableColumnTcdModel<MemberAndUserModel>[]>(
    () => [
      {
        type: ColumnTypeTcdEnum.ordinal,
        pinType: "left",
      },
      {
        width: 60,
        type: ColumnTypeTcdEnum.action,
        render: (param: ColumnRenderParamTcd<MemberAndUserModel>) => {
          return (
            <TableViewDetailTcd
              href={`${myPathName}/detail/${param.rowData.memberId}`}
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
        field: "fullName",
        minWidth: 100,
      },
      {
        header: "Năm sinh",
        field: "yearOfBirthText",
        width: 100,
        sortable: false,
      },
      {
        header: "TG tạo",
        field: "insertTime",
        width: 100,
        render: (param: ColumnRenderParamTcd<MemberAndUserModel>) =>
          DateTimeHelper.getDateTimeString(param.rowData.insertTime),
      },
    ],
    []
  );
  //#endregion

  //#region states
  const cancelGetListRef = useRef<CancelTokenModel>(undefined);
  const filterDefault: MemberFilterModel =
    CommonHelper.getModelValue(filterProperties);

  const [filter, setFilter] = useState<MemberFilterModel>({
    ...filterDefault,
  });

  const [pagination, setPagination] = useState<PaginationModel | undefined>(
    CommonConst.paginationDefault
  );
  const [listData, setListData] = useState<MemberAndUserModel[]>();
  const [isLoading, setIsLoading] = useState(false);

  const [isFilterChange, setIsFilterChange] = useState<boolean>(false);
  const sortConfig: SortTableConfigModel = useMemo(() => {
    return {
      orderBy: filter.orderBy,
      isDesc: filter.isDesc,
    };
  }, [filter.orderBy, filter.isDesc]);
  const [listSelectMember, setListSelectMember] = useState<SelectDataModel[]>(
    []
  );
  //#endregion

  //#region useEffects
  useEffect(() => {
    if (props.formProps.stateId) {
      const filterFromQuery =
        useCommonHelperState.getFilterByUrl<MemberFilterModel>(
          filterProperties
        );
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
    MemberService.GetListSelect({}).then((res) => {
      setListSelectMember(res);
    });
  }

  function handleGetList(filterParam?: MemberFilterModel) {
    const filterToSave = filterParam ?? filter;
    if (isFilterChange) {
      filterToSave.pageIndex = 1;
    }
    let filterRequest: MemberFilterModel = {
      ...filterToSave,
      searchColumn: undefined,
      searchKeyword: undefined,
      isOpenFilter: undefined,
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

    MemberService.GetList(filterRequest, cancelGetListRef.current)
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

  function detailClick(record: MemberAndUserModel) {
    props.onFormModeChange?.({
      formMode: FormModeEnum.detail,
      stateId: CommonHelper.generateFormStateId(),
      recordId: record.memberId,
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
    const filterTemp: MemberFilterModel = {
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
    const filteTemp: MemberFilterModel = {
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

  //#region private components
  function filterExtendComponent() {
    return (
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
            onChange={(e: InputChangeModel) => {
              handleFilterChange("listMemberHide", e.value);
            }}
          />
        </ColTcd>
      </RowTcd>
    );
  }
  //#endregion

  //#region main return
  return (
    <ContentTcd title={"Danh sách thành viên"}>
      <ToolbarFilterTcd
        searchKeyword={filter.searchKeyword}
        searchColumn={filter.searchColumn}
        filterTypeOptions={filterTypeOptions}
        isOpen={filter.isOpenFilter}
        isShowButtonAdd={false}
        filterExtend={filterExtendComponent()}
        onResetFilter={handleResetFilter}
        onSearch={handleSearch}
        onOpenChange={(isOpen?: boolean) =>
          handleFilterChange("isOpenFilter", isOpen)
        }
        onFilterChange={handleFilterChange}
      ></ToolbarFilterTcd>
      <TableTcd<MemberAndUserModel>
        columnConfigs={columnConfig}
        data={listData}
        sortConfig={sortConfig}
        height={CommonConst.table.heightDefault}
        isLoading={isLoading}
        ref={tableRef}
        columnKey="memberId"
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
