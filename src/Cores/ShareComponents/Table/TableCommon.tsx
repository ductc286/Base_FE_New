import { ReactNode, useState } from "react";

import CommonConst from "@src/Cores/Constants/CommonConst";
import {
  DataTypeEnum,
  PlacementEnum,
  SizeEnum,
} from "@src/Cores/Enums/CommonEnum";
import CommonHelper from "@src/Cores/Helpers/CommonHelper";
import { ListItemModel } from "@src/Cores/Models/CommonModels";
import TableConfigColumnTcd from "@src/Cores/ShareComponents/Table/TableComponents/TableConfigColumnTcd";

import ButtonTcd from "../ButtonTcd";
import IconTcd from "../IconTcd";
import PopoverOptionTcd from "../PopoverOptionTcd";

//#region models
export enum ColumnTypeTcdEnum {
  default,
  ordinal,
  checkbox,
  radio,
  action,
  rowReorder,
}

export enum PinTypeEnum {
  left = "left",
  right = "left",
}

export interface ColumnRenderParamTcd<TEntity> {
  rowIndex: number;
  rowData: TEntity;
  columnValue: any;
}

export interface TableColumnTcdModel<TEntity> {
  colKey?: string;
  header?: string;
  field?: string;
  width?: string | number;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
  suppressSizeToFit?: boolean;
  type?: ColumnTypeTcdEnum;
  //isPin?: boolean;
  dataType?: DataTypeEnum;
  pinType?: "left" | "right";
  isHide?: boolean;
  rowReorder?: boolean; //có được phép kéo thả thay đổi vị trí

  render?: ReactNode | ((param: ColumnRenderParamTcd<TEntity>) => ReactNode); //hàm render, itemData là data từ model truyền vào từ props : data của Table
}

export interface TableColumnTcdConfig
  extends Omit<TableColumnTcdModel<any>, "render"> {}

export interface SortTableConfigModel {
  orderBy?: string;
  isDesc?: boolean;
  testSort?: {
    a?: string;
    b?: string;
  }[];
}

export interface TableSelectModel {
  keyValues?: string[];
  dataValues?: any;
}

export interface TableRefTcd<TEntity> {
  api?: {
    sizeColumnsToFit?: () => void;
    autoSizeAllColumns?: () => void;
    setRowDatas?: (rowDataParams?: TEntity) => void;
    setSelecteds?: (keySelectedParams?: string[] | undefined) => void;
  };
  table?: {
    conlumnConfigs?: TableColumnTcdModel<TEntity>[]; //cấu hình hiện tại
    conlumnConfigsDefault?: TableColumnTcdModel<TEntity>[]; //Cấu hình mặc định, khi khôi phục cấu hình
    sortConfig?: SortTableConfigModel;
    sortConfigDefault?: SortTableConfigModel;

    setColumnConfigs?: (conlumnConfigs: TableColumnTcdModel<TEntity>[]) => void;
    setSortConfig?: (sortConfig: SortTableConfigModel) => void;
    tableId?: string;
  };

  isHideConfig?: boolean;
}

export enum RowSelectionType {
  single,
  multiple,
}
export interface RowReorderMod<TEntity> {
  data: TEntity[] | undefined;
}
export interface ColeorderMod<TEntity> {
  data: TableColumnTcdModel<TEntity>[];
}

export interface TableTcdModel<TEntity extends object> {
  columnConfigs: TableColumnTcdModel<TEntity>[];
  data?: TEntity[];
  sortConfig?: SortTableConfigModel;
  height?: string;
  isLoading?: boolean;
  // columnKey?: string; //cột chính để làm key cho việc render dữ liệu
  columnKey?: keyof TEntity; //cột chính để làm key cho việc render dữ liệu
  keySelecteds?: string[];
  rowSelecteds?: TEntity[];
  rowSelectionType?: RowSelectionType;
  sortableDefault?: boolean;
  reorderableColumns?: boolean;
  reorderableRows?: boolean;

  onSortChange?: (sortConfig?: SortTableConfigModel) => void;
  ref?: TableRefTcd<TEntity>;
  onFake?: () => void;
  onSelectChange?: (param: TableSelectModel) => void;
  onReady?: (tableApi?: TableRefTcd<TEntity> | null) => void;
  onRowReorder?: (param: RowReorderMod<TEntity>) => void;
  onColReorder?: (param: ColeorderMod<TEntity>) => void;
}
//#endregion

//#region private componentsprops:
export function TableHeaderTcd<TEntity extends object>({
  columnConfig,
  tableProps,
}: Readonly<{
  columnConfig?: TableColumnTcdModel<TEntity>;
  tableProps: TableTcdModel<TEntity>;
}>) {
  const { sortConfig, onSortChange } = tableProps;
  function fun_getResultConfig() {
    if (sortConfig?.orderBy === columnConfig?.field && !sortConfig?.isDesc) {
      return {
        orderBy: columnConfig?.field,
        isDesc: true,
      };
    }
    if (sortConfig?.orderBy === columnConfig?.field && sortConfig?.isDesc) {
      return {};
    }
    return {
      orderBy: columnConfig?.field,
      isDesc: false,
    };
  }

  let sortable = columnConfig?.sortable ?? tableProps.sortableDefault;
  if (columnConfig?.type === ColumnTypeTcdEnum.action) {
    sortable = false;
  }
  return (
    <div
      className={CommonHelper.concatClassNames(
        "flex gap-1",
        sortable && "cursor-pointer"
      )}
      onClick={() => {
        if (sortable) {
          onSortChange?.(fun_getResultConfig());
        }
      }}
    >
      <div>{columnConfig?.header}</div>
      <div className="flex items-center text-xs">
        <TableSortIconTcd
          columnConfig={columnConfig}
          tableProps={tableProps}
        ></TableSortIconTcd>
      </div>
    </div>
  );
}

export function TableSortIconTcd<TEntity extends object>({
  columnConfig,
  tableProps,
}: Readonly<{
  columnConfig?: TableColumnTcdModel<TEntity>;
  tableProps: TableTcdModel<TEntity>;
}>) {
  const { sortConfig } = tableProps;
  let sortable = columnConfig?.sortable ?? tableProps.sortableDefault;
  if (columnConfig?.type === ColumnTypeTcdEnum.action) {
    sortable = false;
  }
  if (sortable) {
    //Nếu có đang sort cột hiện tại
    if (sortConfig?.orderBy && sortConfig?.orderBy === columnConfig?.field) {
      if (!sortConfig.isDesc) {
        return (
          <IconTcd
            icon="fa-solid fa-arrow-up"
            className="cursor-pointer w-1rem"
          ></IconTcd>
        );
      }
      return (
        <IconTcd
          icon="fa-solid fa-arrow-down"
          className="cursor-pointer w-1rem"
        ></IconTcd>
      );
    } else {
      return (
        <IconTcd
          icon="fa-solid fa-sort"
          className="cursor-pointer w-1rem"
        ></IconTcd>
      );
    }
  }
  return <></>;
}

export function TableNoDataTcd() {
  return <>Không có bản ghi nào tìm thấy</>;
}
//#endregion

//#region

interface TableSettingTcdModel<TEntity> {
  tableApi?: TableRefTcd<TEntity> | null;
  size?: SizeEnum;
}

export function TableSettingTcd<TEntity>(
  props: Readonly<TableSettingTcdModel<TEntity>>
) {
  const [isOpen, setIsOpen] = useState(false);
  const listItem: ListItemModel[] = [
    {
      label: "Chỉnh kích thước cột theo màn hình",
      onclick: () => {
        props.tableApi?.api?.sizeColumnsToFit?.();
      },
      isHide: true,
    },
    {
      label: "Chỉnh kích thước cột theo nội dung",
      onclick: () => {
        props.tableApi?.api?.autoSizeAllColumns?.();
      },
      isHide: true,
    },
    {
      label: "Cấu hình cột",
      onclick: () => {
        setIsOpen(true);
      },
    },
  ];

  return (
    <>
      <PopoverOptionTcd listItem={listItem} placement={PlacementEnum.bottomEnd}>
        <ButtonTcd
          icon={CommonConst.classIcon.setting}
          isNoBackground
          size={props.size}
        ></ButtonTcd>
      </PopoverOptionTcd>
      <TableConfigColumnTcd<TEntity>
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          setIsOpen(isOpen ?? false);
        }}
        tableApi={props.tableApi}
      ></TableConfigColumnTcd>
    </>
  );
}

//#endregion
