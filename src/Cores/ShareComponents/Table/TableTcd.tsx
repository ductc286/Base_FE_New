import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import TablePrimereactTcd from "@src/Cores/ShareComponents/Table/Primereact/TablePrimereactTcd";

import {
  ColumnTypeTcdEnum,
  RowSelectionType,
  TableRefTcd,
  TableTcdModel,
} from "./TableCommon";

function TableTcd<TEntity extends object>(
  props: Readonly<TableTcdModel<TEntity>>,
  ref?: ForwardedRef<TableRefTcd<TEntity>> | null
) {
  //#region states
  const tableRef = useRef<TableRefTcd<TEntity> | null>(null);
  const [tableRefState, setTableRefState] = useState<
    TableRefTcd<TEntity> | null | undefined
  >(null);
  // const isFirst = useIsFirstRender();
  useImperativeHandle(ref, () => tableRefState ?? {});
  const rowSelectionType = useMemo(() => {
    if (props.rowSelectionType) {
      return props.rowSelectionType;
    }
    if (
      props.columnConfigs?.some((x) => x.type === ColumnTypeTcdEnum.checkbox)
    ) {
      return RowSelectionType.multiple;
    }
    if (props.columnConfigs?.some((x) => x.type === ColumnTypeTcdEnum.radio)) {
      return RowSelectionType.single;
    }
    return undefined;
  }, [props.rowSelectionType, props.columnConfigs]);
  // const [sortConfig, setSortConfig] = useState<
  //   SortTableConfigModel | undefined
  // >(props.sortConfig);
  // // const [keySelecteds, setKeySelecteds] = useState<string[] | undefined>(
  // //   props.keySelecteds
  // // );
  // //#endregion
  // //#region useEffect
  // useEffect(() => {
  //   if (!isFirst) {
  //     props.onSortChange?.(sortConfig);
  //   }
  // }, [sortConfig]);

  // useEffect(() => {
  //   const dataTemp = props.data ?? ([] as any[]);
  //   const rowValues = dataTemp.filter((x) =>
  //     keySelecteds?.includes(x[props.columnKey ?? ""])
  //   );
  //   props.onSelectChange?.({
  //     keyValues: keySelecteds,
  //     dataValues: rowValues,
  //   });
  // }, [keySelecteds]);

  // useEffect(() => {
  //   if (
  //     keySelecteds?.length !== props.keySelecteds?.length ||
  //     keySelecteds?.some((x) => !props.keySelecteds?.includes(x))
  //   ) {
  //     setKeySelecteds(props.keySelecteds);
  //     tableRef.current?.api?.setSelecteds?.(props.keySelecteds);
  //   }
  // }, [props.keySelecteds]);

  useEffect(() => {
    props.onReady?.(tableRef.current);
    setTableRefState(tableRef.current);
  }, []);

  //#endregion

  //#region main render
  return (
    // <TableAgGridTcd<TEntity>
    //   {...props}
    //   ref={tableRef}
    //   rowSelectionType={rowSelectionType}
    //   sortableDefault={props.sortableDefault ?? true}
    //   onSortChange={(sortConfig?: SortTableConfigModel | undefined) => {
    //     setSortConfig(sortConfig);
    //   }}
    //   // sortConfig={sortConfig}
    //   sortConfig={props.sortConfig}
    //   onSelectChange={(param: TableSelectModel) => {
    //     setKeySelecteds(param.keyValues);
    //   }}
    //   keySelecteds={keySelecteds}
    // ></TableAgGridTcd>
    <TablePrimereactTcd<TEntity>
      {...props}
      // ref={tableRef}
      rowSelectionType={rowSelectionType}
      sortableDefault={props.sortableDefault ?? true}
      // onSortChange={(sortConfig?: SortTableConfigModel | undefined) => {
      //   setSortConfig(sortConfig);
      // }}
      onSortChange={props.onSortChange}
      // sortConfig={sortConfig}
      sortConfig={props.sortConfig}
      // onSelectChange={(param: TableSelectModel) => {
      //   setKeySelecteds(param.keyValues);
      // }}
      // keySelecteds={keySelecteds}
      keySelecteds={props.keySelecteds}
      onSelectChange={props.onSelectChange}
    ></TablePrimereactTcd>
  );
  //#endregion
}

declare module "react" {
  function forwardRef<TEntity extends object, P = {}>(
    render: (props: P, ref: React.Ref<TEntity>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<TEntity>) => React.ReactElement | null;
}
const TableExportDefault = forwardRef(TableTcd);
export default TableExportDefault;
