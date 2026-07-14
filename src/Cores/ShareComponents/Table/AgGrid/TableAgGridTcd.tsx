// // import "ag-grid-community/styles/ag-theme-quartz.css";
// import {
//   IsRowSelectable,
//   RowNode,
//   SelectionChangedEvent,
// } from "ag-grid-community";
// import { ColDef, LicenseManager } from "ag-grid-enterprise";
// import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
// import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
// import {
//   ForwardedRef,
//   forwardRef,
//   useEffect,
//   useImperativeHandle,
//   useMemo,
//   useRef,
// } from "react";

// import CommonConst from "@src/Cores/Constants/CommonConst";
// import CommonHelper from "@src/Cores/Helpers/CommonHelper";
// import SecurityHelper from "@src/Cores/Helpers/SecurityHelper";

// import LoadingTcd from "../../LoadingTcd";
// import {
//   ColumnTypeTcdEnum,
//   RowSelectionType,
//   TableColumnTcdModel,
//   TableHeaderTcd,
//   TableNoDataTcd,
//   TableRefTcd,
//   TableTcdModel,
// } from "../TableCommon";

// import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
// import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

// LicenseManager.setLicenseKey(
//   SecurityHelper.deCodePassWordLevelLow(
//     "b2tDb21wYW55TmFtZT1VTklDTE9VRCBURUNITk9MT0dZIEdST1VQIC4sSlNDLExpY2Vuc2VkR3JvdXA9VU5JQ0xPVUQgVEVDSE5PTE9HWSBHUk9VUCAuLEpTQyxMaWNlbnNlVHlwZT1NdWx0aXBsZUFwcGxpY2F0aW9ucyxMaWNlbnNlZENvbmN1cnJlbnREZXZlbG9wZXJDb3VudD0xLExpY2Vuc2VkUHJvZHVjdGlvbkluc3RhbmNlc0NvdW50PTAsQXNzZXRSZWZlcmVuY2U9QUctMDIzMTc5LEV4cGlyeURhdGU9OV9EZWNlbWJlcl8yMDIyX1t2Ml1fTVRZM01EVTBOREF3TURBd01BPT0xMTRhMjJiMzZhOGQwZTVmY2I3ZGE3NThkNzRiODc1Yw"
//   ) ?? ""
// );

// function TableAgGridTcdDefine<TEntity extends object>(
//   props: Readonly<TableTcdModel<TEntity>>,
//   ref?: ForwardedRef<TableRefTcd<TEntity>> | null
// ) {
//   //#region states
//   const tableRef = useRef<AgGridReactType>(null);
//   const isFirstLoadData = useRef<boolean>(false);
//   const isRowSelectable = useMemo<IsRowSelectable>(() => {
//     return (params: any) => {
//       return !!params.data && !params.data[CommonConst.keyDisableItemInTable];
//     };
//   }, []);
//   // const [keySelecteds, setKeySelecteds] = useState<string[] | undefined>(
//   //   props.keySelecteds
//   // );
//   //#endregion

//   //#region ref instance
//   useImperativeHandle(ref, () => apiRef);
//   const apiRef: TableRefTcd<TEntity> = {
//     api: {
//       sizeColumnsToFit() {
//         setTimeout(() => {
//           tableRef.current?.api?.sizeColumnsToFit({
//             defaultMinWidth: 50,
//           });
//         }, 50);
//       },

//       autoSizeAllColumns() {
//         if (!tableRef.current) {
//           return;
//         }
//         const allColumnIds: any[] = [];
//         tableRef.current.columnApi
//           .getColumns()
//           ?.forEach((column: { getId: () => any }) => {
//             const columnId = column.getId();
//             if (columnId !== "_action" && columnId !== "stt") {
//               allColumnIds.push(column.getId());
//             }
//           });
//         tableRef.current.columnApi.autoSizeColumns(allColumnIds, false);
//       },

//       setSelecteds(keySelectedParams?: string[] | undefined) {
//         if (!tableRef.current) {
//           return;
//         }
//         const keySelecteds = keySelectedParams ?? [];
//         const keyColumnName = props.columnKey ?? "";
//         tableRef.current?.api?.forEachNode(function (node: RowNode<any>) {
//           const isSelected = keySelecteds.some(
//             (x) => x === node.data[keyColumnName]
//           );
//           node.setSelected(isSelected, undefined, true);
//         });
//       },
//     },
//   };

//   //#endregion

//   //#region useEffect
//   //xử lý select khi thay đổi data
//   useEffect(() => {
//     if (tableRef.current?.api) {
//       const dataTemps = props.data ?? ([] as any[]);
//       const keySelectedsTemps = props.keySelecteds ?? ([] as string[]);
//       const selectedValids = keySelectedsTemps?.filter((x) =>
//         dataTemps.some((y) => y[props.columnKey ?? ""] === x)
//       );
//       apiRef.api?.setSelecteds?.(selectedValids);
//       if (selectedValids.length !== keySelectedsTemps.length) {
//         props.onSelectChange?.({
//           keyValues: selectedValids,
//         });
//       }
//       if (!isFirstLoadData.current) {
//         isFirstLoadData.current = true;
//         setTimeout(() => {
//           tableRef.current?.api.sizeColumnsToFit();
//         }, 50);
//       }
//     }
//   }, [props.data]);

//   //#endregion

//   //#region functions
//   const myConfigColumns = useMemo(() => {
//     return props.columnConfigs?.map((x, index) => {
//       const reuslt = { ...x };
//       if (
//         x.type !== ColumnTypeTcdEnum.default &&
//         !CommonHelper.isNull(x.type) &&
//         !x.colKey
//       ) {
//         reuslt.colKey = "_".concat(ColumnTypeTcdEnum[x.type!]);
//       } else if (!x.colKey) {
//         reuslt.colKey = x.field;
//       }

//       return reuslt;
//     });
//   }, [props.columnConfigs]);

//   function getPinType(input: boolean | "left" | "right" | null | undefined) {
//     if (input == "left") {
//       return "left";
//     }
//     if (input == "right") {
//       return "right";
//     }
//     return undefined;
//   }
//   const columnConfigs = useMemo(() => {
//     if (tableRef.current?.api) {
//       const currentColumns = tableRef.current.api.getColumnDefs() as any[];
//       const columnConvert = currentColumns.map(function (val: ColDef<TEntity>) {
//         const resultItem = myConfigColumns.find((x) => x.colKey === val.colId);
//         if (resultItem) {
//           resultItem.width = val.width;
//           resultItem.pinType = getPinType(val.pinned);
//         }
//         return resultItem;
//       });

//       const result = columnConvert?.map(function (
//         column?: TableColumnTcdModel<TEntity>,
//         i?: number
//       ) {
//         return getColumnElement(column ?? {}, i ?? 0);
//       });
//       return result;
//     } else {
//       const result = myConfigColumns?.map(function (column, i) {
//         return getColumnElement(column, i);
//       });
//       return result;
//     }
//   }, [myConfigColumns, props.sortConfig]);
//   // }, [props]);

//   function getWidthValue(width: string | number | undefined) {
//     if (CommonHelper.isNullOrEmpty(width)) return undefined;

//     if (typeof width === typeof "") {
//       return undefined;
//     }

//     return Number(width);
//   }

//   function getColumnElement(
//     configParams: TableColumnTcdModel<TEntity>,
//     i: number
//   ): ColDef {
//     if (configParams.type === ColumnTypeTcdEnum.ordinal) {
//       return {
//         colId: configParams.colKey,
//         field: "_ordinal",
//         headerName: configParams.header ?? "#",
//         width: getWidthValue(configParams.width ?? 60),
//         cellRenderer: (params: any) => <>{params.rowIndex + 1}</>,
//         suppressSizeToFit: true,
//         pinned: configParams.pinType,
//       };
//     }

//     if (configParams.type === ColumnTypeTcdEnum.checkbox) {
//       return {
//         colId: configParams.colKey,
//         field: "_checkbox",
//         headerName: configParams.header ?? "",
//         width: getWidthValue(configParams.width ?? 50),
//         headerCheckboxSelection: true,
//         checkboxSelection: true,
//         showDisabledCheckboxes: true,
//         suppressSizeToFit: true,
//         maxWidth: 50,
//         pinned: configParams.pinType,
//       };
//     }

//     const result = {
//       colId: configParams.colKey,
//       field: configParams.field,
//       headerName: configParams.header,
//       headerComponent: () => (
//         <TableHeaderTcd
//           columnConfig={configParams}
//           tableProps={props}
//         ></TableHeaderTcd>
//       ),
//       cellRenderer: !configParams.render
//         ? undefined
//         : (params: any) => {
//             return configParams?.render?.({
//               rowIndex: params.rowIndex,
//               rowData: params.data,
//               columnValue: params.value,
//             });
//           },
//       width: getWidthValue(configParams.width),
//       minWidth: configParams.minWidth,
//       maxWidth: configParams.maxWidth,
//       pinned: configParams.pinType,
//       suppressSizeToFit: configParams.suppressSizeToFit,
//     };

//     if (
//       configParams.type === ColumnTypeTcdEnum.action &&
//       result.suppressSizeToFit === undefined
//     ) {
//       result.suppressSizeToFit = true;
//     }
//     return result;
//   }

//   const defaultColDef = useMemo(() => {
//     return {
//       resizable: true,
//       sortable: false,
//       unSortIcon: true, //hiển thị icon sort
//       // filter: true,
//       // floatingFilter: true,//chế độ ô nhập ở header cho filter
//       // filter: "agTextColumnFilter",
//       // floatingFilterComponentParams: { suppressFilterButton: true },//ẩn nút button filter ở bên cạnh ô nhập filter
//       suppressMenu: true, //ẩn button filter ở tiêu đề cột
//     };
//   }, []);
//   //#endregion

//   //#region private components

//   //#endregion

//   //#region main render
//   const mainTable = useMemo(() => {
//     return (
//       <AgGridReact
//         // rowData={undefined}
//         rowData={props.data}
//         columnDefs={columnConfigs}
//         defaultColDef={defaultColDef}
//         key={props.columnKey}
//         enableCellTextSelection={true} //lưới văn bản thông thường
//         ensureDomOrder={true} //lưới văn bản thông thường
//         noRowsOverlayComponent={TableNoDataTcd}
//         rowSelection={
//           props.rowSelectionType === RowSelectionType.multiple
//             ? "multiple"
//             : props.rowSelectionType === RowSelectionType.single
//               ? "single"
//               : undefined
//         }
//         rowMultiSelectWithClick={true}
//         onSelectionChanged={(event: SelectionChangedEvent<any>) => {
//           const rowSelectedTemps = event.api.getSelectedRows();
//           const keySelectedTemps = rowSelectedTemps.map(
//             (x) => x[props.columnKey ?? ""]
//           );
//           props.onSelectChange?.({
//             keyValues: keySelectedTemps,
//             dataValues: rowSelectedTemps,
//           });
//         }}
//         ref={tableRef}
//         onGridReady={(event) => {
//           event?.api.sizeColumnsToFit();
//         }}
//         isRowSelectable={isRowSelectable}
//         getContextMenuItems={(params) => {
//           return ["copy", "excelExport", "csvExport"];
//         }} //setting action khi bấm chuột phải vào item
//         suppressContextMenu={true} //bỏ qua action khi bấm chuột phải vào item
//       />
//     );
//   }, [props.data, props.columnConfigs, props.sortConfig, props.keySelecteds]);
//   // }, [props]);
//   return (
//     <LoadingTcd isLoading={props.isLoading}>
//       <div className="table-container-tcd">
//         <div style={props.height ? { height: props.height } : undefined}>
//           <div className="ag-theme-alpine" style={{ height: "100%" }}>
//             {mainTable}
//           </div>
//         </div>
//       </div>
//     </LoadingTcd>
//   );
//   //#endregion
// }

// declare module "react" {
//   function forwardRef<TEntity, P = {}>(
//     render: (props: P, ref: React.Ref<TEntity>) => React.ReactElement | null
//   ): (props: P & React.RefAttributes<TEntity>) => React.ReactElement | null;
// }
// const TableAgGridTcd = forwardRef(TableAgGridTcdDefine);
// export default TableAgGridTcd;
