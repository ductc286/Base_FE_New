import { Column, ColumnBodyOptions } from "primereact/column";
import { DataTable, DataTableRowReorderEvent } from "primereact/datatable";
import { useMemo, useRef } from "react";

import CommonHelper from "@src/Cores/Helpers/CommonHelper";

import LoadingTcd from "../../LoadingTcd";
import {
  ColumnTypeTcdEnum,
  TableColumnTcdModel,
  TableHeaderTcd,
  TableSelectModel,
  TableTcdModel,
} from "./../TableCommon";

export default function TablePrimereactTcd<TEntity extends object>(
  props: Readonly<TableTcdModel<TEntity>>
) {
  //#region constants
  // const tableRef = useRef<DataTable<MemberAndUserModel[]> | null>(null);
  const tableRef = useRef<DataTable<TEntity[]>>(null);
  //#endregion

  const rowSelecteds: TEntity[] | TEntity | undefined = useMemo(() => {
    if (
      props.columnConfigs?.some((x) => x.type === ColumnTypeTcdEnum.checkbox) &&
      props.keySelecteds
    ) {
      const dynamicKey = props.columnKey as keyof TEntity;
      const ret = props.data?.filter((x) =>
        props.keySelecteds?.includes(String(x[dynamicKey]))
      );
      return ret;
    }

    return undefined;
  }, [props.keySelecteds]);

  //#region handle columns
  function renderColumnOrdinal(data: any, options: ColumnBodyOptions) {
    return <>{options.rowIndex + 1}</>;
  }

  function getColumnElement(
    configParams: TableColumnTcdModel<TEntity>,
    i: number
  ) {
    if (configParams.type === ColumnTypeTcdEnum.ordinal) {
      return (
        <Column
          columnKey={configParams.colKey}
          alignHeader="center"
          header="#"
          style={{ width: "50px", textAlign: "center" }}
          body={renderColumnOrdinal}
          frozen
          rowReorder={configParams.rowReorder}
          hidden={configParams.isHide}
        ></Column>
      );
    }
    if (configParams.type === ColumnTypeTcdEnum.checkbox) {
      return (
        <Column
          columnKey={configParams.colKey}
          key={configParams.colKey}
          alignHeader="center"
          style={{ width: "50px", textAlign: "center" }}
          selectionMode="multiple"
          frozen
          rowReorder={configParams.rowReorder}
          hidden={configParams.isHide}
        ></Column>
      );
    }
    if (configParams.type === ColumnTypeTcdEnum.rowReorder) {
      return <Column rowReorder></Column>;
    }
    return (
      <Column
        columnKey={configParams.colKey}
        field={configParams.field}
        headerStyle={getStyle(configParams)}
        header={
          <TableHeaderTcd
            columnConfig={configParams}
            tableProps={props}
          ></TableHeaderTcd>
        }
        style={getStyle(configParams)}
        body={
          configParams?.render
            ? (data: any, options: ColumnBodyOptions) => {
                return typeof configParams.render === "function"
                  ? configParams?.render?.({
                      rowIndex: options.rowIndex,
                      rowData: data,
                      columnValue: data[configParams.field ?? "unknown"],
                    })
                  : configParams.render;
              }
            : undefined
        }
        frozen={configParams.pinType !== undefined}
        rowReorder={configParams.rowReorder}
        hidden={configParams.isHide}
        // reorderable={false}
        // sortable
      ></Column>
    );
  }

  function getStyle(columnConfigParam: TableColumnTcdModel<TEntity>) {
    return columnConfigParam.width
      ? { width: columnConfigParam.width }
      : undefined;
  }
  //#endregion

  //#region private components
  //#endregion

  //#region main render
  const isHaveData = (props.data?.length ?? 0) > 0;
  return (
    <LoadingTcd isLoading={props.isLoading}>
      {/* {toolbarTab()} */}
      <div className="table-container-tcd">
        <div
          className={CommonHelper.concatClassNames(
            "table-content-tcd scroll-tcd",
            !isHaveData && "table-content-empty-tcd"
          )}
          style={props.height ? { height: props.height } : undefined}
        >
          <DataTable
            className="table-maper-tcd"
            value={props.data}
            columnResizeMode="expand"
            resizableColumns
            stripedRows
            dataKey={props.columnKey}
            scrollable
            ref={tableRef}
            selection={rowSelecteds ?? []}
            onSelectionChange={(e) => {
              if (!e.value) {
                return {};
              }
              const dynamicKey = props.columnKey as keyof TEntity;
              const listTemp = e.value as any[];
              const listKeys = listTemp.map((x) => x[dynamicKey]);
              const paramTemp: TableSelectModel = {
                dataValues: e.value,
                keyValues: listKeys,
              };
              props.onSelectChange?.(paramTemp);
            }}
            selectionMode="multiple"
            metaKeySelection={false}
            reorderableRows={props.reorderableRows}
            reorderableColumns={props.reorderableColumns}
            onColReorder={(param) => {
              const colConvert: TableColumnTcdModel<TEntity>[] = [];
              param.columns.forEach((element) => {
                const found = props.columnConfigs.find(
                  (x) =>
                    (x.colKey === element.props.columnKey &&
                      !CommonHelper.isNullOrEmpty(x.colKey)) ||
                    (x.field === element.props.field &&
                      !CommonHelper.isNullOrEmpty(x.field))
                );
                if (found) {
                  colConvert.push(found);
                }
              });
              props.onColReorder?.({ data: colConvert });
            }}
            onRowReorder={(event: DataTableRowReorderEvent<TEntity[]>) => {
              props.onRowReorder?.({ data: event.value });
            }}
            // dragSelection
          >
            {(props.columnConfigs ?? []).map(function (column, i) {
              return getColumnElement(column, i);
            })}
          </DataTable>
          {!isHaveData && (
            <div className="table-empty-tcd">
              Không có kết quả nào được tìm thấy
            </div>
          )}
        </div>
      </div>
    </LoadingTcd>
  );
  //#endregion
}
