// import ReactDataGrid from "@inovua/reactdatagrid-enterprise";
// import {
//   TypeColumn,
//   TypeComputedProps,
// } from "@inovua/reactdatagrid-enterprise/types";
// import { MutableRefObject, useMemo, useState } from "react";

// import CommonHelper from "@src/Cores/Helpers/CommonHelper";

// import LoadingTcd from "../../LoadingTcd";
// import {
//   ColumnTypeTcdEnum,
//   TableColumnTcdModel,
//   TableHeaderTcd,
//   TableTcdModel,
// } from "../TableCommon";

// import "@inovua/reactdatagrid-enterprise/index.css";

// const gridStyle = { minHeight: 550 };

// export default function TableReactdatagrid<TEntity extends object>(
//   props: Readonly<TableTcdModel<TEntity>>
// ) {
//   //#region constants
//   //#endregion

//   //#region states
//   const [gridRef, setGridRef] = useState<
//     MutableRefObject<TypeComputedProps | null> | undefined
//   >();
//   //#endregion

//   //#region private components

//   //#endregion

//   //#region main render

//   const columnConfigs: TypeColumn[] = useMemo(() => {
//     const columnConfigTemp = props.columnConfigs?.filter(
//       (x) => x.type !== ColumnTypeTcdEnum.checkbox
//     );
//     const columnTemp = columnConfigTemp?.map(function (column, i) {
//       return getColumnElement(column, i);
//     });
//     return columnTemp;
//   }, [props.columnConfigs, props.sortConfig]);

//   function getColumnElement(
//     configParams: TableColumnTcdModel<TEntity>,
//     i: number
//   ): TypeColumn {
//     if (configParams.type === ColumnTypeTcdEnum.ordinal) {
//       return {
//         name: "_ordinal",
//         header: configParams.header ?? "#",
//         render: (params: any) => <>{params.rowIndex + 1}</>,
//         defaultWidth: 60,
//       };
//     }

//     return {
//       name: configParams.field,
//       header: () => (
//         <TableHeaderTcd
//           columnConfig={configParams}
//           tableProps={props}
//         ></TableHeaderTcd>
//       ),
//       defaultFlex: 1,
//       defaultWidth: configParams.width ? Number(configParams.width) : undefined,
//       render: !configParams.render
//         ? undefined
//         : (params: any) => {
//             return configParams?.render?.({
//               rowIndex: params.rowIndex,
//               rowData: params.data,
//               columnValue: params.value,
//             });
//           },
//     };
//   }

//   const isHaveData = (props.data?.length ?? 0) > 0;
//   const mainTable = useMemo(() => {
//     return (
//       <ReactDataGrid
//         idProperty={props.columnKey}
//         columns={columnConfigs}
//         dataSource={props.data ?? []}
//         style={gridStyle}
//         checkboxColumn
//         onSelectionChange={(data) => {
//           const keySelectedTemps = !data.selected
//             ? []
//             : Object.keys(data.selected!);
//           props.onSelectChange?.({ keyValues: keySelectedTemps });
//         }}
//         onReady={setGridRef}
//         showColumnMenuTool={false}
//         sortable={false}
//       />
//     );
//   }, [props.data, props.columnConfigs, props.sortConfig, props.keySelecteds]);
//   return (
//     <LoadingTcd isLoading={props.isLoading}>
//       <div className="table-container-tcd">
//         <button
//           onClick={() => {
//             const valueTemp: ObjectBooleanModel = {};
//             props.keySelecteds?.forEach((x) => {
//               valueTemp[x] = true;
//             });
//             gridRef?.current?.setSelected(valueTemp);
//           }}
//         >
//           ok
//         </button>
//         <div
//           className={CommonHelper.concatClassNames(
//             "table-content-tcd scroll-tcd",
//             !isHaveData && "table-content-empty-tcd"
//           )}
//           style={
//             props.height
//               ? { minHeight: props.height, height: props.height }
//               : undefined
//           }
//         >
//           {mainTable}
//         </div>
//       </div>
//     </LoadingTcd>
//   );
//   //#endregion
// }
