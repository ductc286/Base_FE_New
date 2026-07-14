// import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
// import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
// // import "ag-grid-community/styles/ag-theme-quartz.css";
// import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
// import { useMemo, useRef, useState } from "react";
// import CommonHelper from "@src/Cores/Helpers/CommonHelper";
// import LoadingTcd from "../../LoadingTcd";
// import {
//   ColumnTypeTcdEnum,
//   TableColumnTcdModel,
//   TableHeaderTcd,
//   TableTcdModel,
// } from "../TableTcd";

// import "ag-grid-enterprise";
// import { ColDef, LicenseManager } from "ag-grid-enterprise";
// LicenseManager.setLicenseKey(
//   "CompanyName=UNICLOUD TECHNOLOGY GROUP .,JSC,LicensedGroup=UNICLOUD TECHNOLOGY GROUP .,JSC,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-023179,ExpiryDate=9_December_2022_[v2]_MTY3MDU0NDAwMDAwMA==114a22b36a8d0e5fcb7da758d74b875c"
// );
// export default function TableTcd<TEntity extends object>(
//   props: Readonly<TableTcdModel<TEntity>>
// ) {
//   //#region constants
//   // const tableRef = useRef<DataTable<MemberAndUserModel[]> | null>(null);
//   const tableRef = useRef<any>(null);
//   //#endregion

//   const rowSelecteds: TEntity[] | T | undefined = useMemo(() => {
//     if (
//       props.columnConfigs?.some((x) => x.type === ColumnTypeTcdEnum.checkbox) &&
//       props.keySelecteds
//     ) {
//       const dynamicKey = props.columnKey as keyof TEntity;
//       const ret = props.data?.filter((x) =>
//         props.keySelecteds?.includes(String(x[dynamicKey]))
//       );
//       return ret;
//     }

//     return undefined;
//   }, [props.keySelecteds]);

//   //#region private components

//   //#endregion

//   //#region main render
//   const [rowData, setRowData] = useState([
//     {
//       mission: "Voyager",
//       company: "NASA",
//       location: "Cape Canaveral",
//       date: "1977-09-05",
//       rocket: "Titan-Centaur ",
//       price: 86580000,
//       successful: true,
//     },
//     {
//       mission: "Apollo 13",
//       company: "NASA",
//       location: "Kennedy Space Center",
//       date: "1970-04-11",
//       rocket: "Saturn V",
//       price: 3750000,
//       successful: false,
//     },
//     {
//       mission: "Falcon 9",
//       company: "SpaceX",
//       location: "Cape Canaveral",
//       date: "2015-12-22",
//       rocket: "Falcon 9",
//       price: 9750000,
//       successful: true,
//     },
//   ]);

//   // Column Definitions: Defines & controls grid columns.
//   const [colDefs, setColDefs] = useState([
//     { field: "mission" },
//     { field: "company" },
//     { field: "location" },
//     { field: "date" },
//     { field: "price" },
//     { field: "successful" },
//     { field: "rocket" },
//   ]);

//   const columnConfigs = useMemo(() => {
//     const columnTemp = props.columnConfigs?.map(function (column, i) {
//       return getColumnElement(column, i);
//     });

//     return columnTemp;
//   }, [props.columnConfigs, props.sortConfig]);

//   const myHeaderComponent = (configParams: TableColumnTcdModel<TEntity>) => (
//     <TableHeaderTcd
//       columnConfig={configParams}
//       sortConfig={props.sortConfig}
//       onSortChange={props.onSortChange}
//     ></TableHeaderTcd>
//   );

//   function getColumnElement(
//     configParams: TableColumnTcdModel<TEntity>,
//     i: number
//   ): ColDef {
//     return {
//       field: configParams.field,
//       headerName: configParams.header,
//       //headerComponent: myHeaderComponent(configParams),
//         headerComponent: () =>
//           (
//             <TableHeaderTcd
//               columnConfig={configParams}
//               sortConfig={props.sortConfig}
//               onSortChange={props.onSortChange}
//             ></TableHeaderTcd>
//           ) ,
//     };
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

//   const isHaveData = (props.data?.length ?? 0) > 0;
//   return (
//     <LoadingTcd isLoading={props.isLoading}>
//       {/* {toolbarTab()} */}
//       <div className="table-container-tcd">
//         <div
//           className={CommonHelper.concatClassNames(
//             "table-content-tcd scroll-tcd",
//             !isHaveData && "table-content-empty-tcd"
//           )}
//           style={props.height ? { height: props.height } : undefined}
//         >
//           <div className="ag-theme-alpine" style={{ height: props.height }}>
//             {/* The AG Grid component */}
//             <AgGridReact
//               rowData={props.data}
//               columnDefs={columnConfigs}
//             //   columnDefs={colDefs}
//               defaultColDef={defaultColDef}
//             />
//           </div>
//           {!isHaveData && (
//             <div className="table-empty-tcd">
//               Không có kết quả nào được tìm thấy
//             </div>
//           )}
//         </div>
//       </div>
//     </LoadingTcd>
//   );
//   //#endregion
// }
