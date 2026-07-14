import { useForm } from "react-hook-form";

import DevPopupHandleStateCpn from "@src/Cores/Components/ShareComponents/DevPopupHandleStateCpn";
import { CommonConst } from "@src/Cores/Constants";
import { SizeEnum } from "@src/Cores/Enums/CommonEnum";
import { ButtonTcd } from "@src/Cores/ShareComponents";
import ContentTcd from "@src/Cores/ShareComponents/ContentTcd";
import ModalTcd from "@src/Cores/ShareComponents/Modal/ModalTcd";
import {
  ColumnTypeTcdEnum,
  TableColumnTcdModel,
  TableRefTcd,
} from "@src/Cores/ShareComponents/Table/TableCommon";
import TableTcd from "@src/Cores/ShareComponents/Table/TableTcd";

export interface TableConfigColumnTcdProp<TEntity> {
  tableApi?: TableRefTcd<TEntity> | null;
  isOpen?: boolean;
  onOpenChange?: (isOpen?: boolean) => void;
}
interface TableConfigColumnMod {
  _colKey?: string;
  colKey?: string;
  column: string;
  isHide: boolean;
  isNotAllowConfig: boolean;
  field?: string;
  type: ColumnTypeTcdEnum;
}
export default function TableConfigColumnTcd<TEntity>(
  props: TableConfigColumnTcdProp<TEntity>
) {
  function handleExit() {
    props.onOpenChange?.(false);
  }
  const conlumnConfigsDefault = [
    {
      pinType: "left",
      type: ColumnTypeTcdEnum.rowReorder,
    },
    {
      type: ColumnTypeTcdEnum.ordinal,
      pinType: "left",
    },

    {
      header: "Cột",
      field: "column",
      minWidth: 100,
    },
    {
      header: "Hiển thị",
      field: "isHide",
      width: 100,
    },
  ] as TableColumnTcdModel<TableConfigColumnMod>[];
  const configProps = props.tableApi?.table?.conlumnConfigs ?? [];
  const listdata = (props.tableApi?.table?.conlumnConfigs ?? []).map(
    (x, index) => {
      const columKey = x.colKey ?? x.field ?? index;
      if (x.type === ColumnTypeTcdEnum.ordinal) {
        return {
          _colKey: columKey,
          colKey: x.colKey,
          column: "#",
          isHide: x.isHide,
          isNotAllowConfig: true,
          field: x.field,
          type: x.type,
        } as TableConfigColumnMod;
      }
      return {
        _colKey: columKey,
        colKey: x.colKey,
        column: x.header,
        isHide: x.isHide,
        field: x.field,
        type: x.type,
      } as TableConfigColumnMod;
    }
  );
  const formmMyState = useForm({
    defaultValues: {
      columnConfig: conlumnConfigsDefault,
      listdata: listdata,
    },
  });

  return (
    <ModalTcd isOpen={props.isOpen} onExit={handleExit} size={SizeEnum.small}>
      <ContentTcd
        title={"Cấu hình table"}
        isSticky
        isShowButtonExit
        onExit={handleExit}
      >
        <div className="mt-2 flex flex-col gap-2">
          <span>
            <ButtonTcd
              text="Áp dụng"
              color={CommonConst.classColor.success}
              icon={CommonConst.classIcon.save}
              onClick={() => {
                const configConverts: TableColumnTcdModel<TEntity>[] = [];
                formmMyState.getValues("listdata").map((x) => {
                  const found = configProps.find(
                    (y) =>
                      (y.colKey && y.colKey === x.colKey) ||
                      (y.field && y.field === x.field) ||
                      (y.type === ColumnTypeTcdEnum.ordinal &&
                        x.type === ColumnTypeTcdEnum.ordinal) ||
                      (y.type === ColumnTypeTcdEnum.action &&
                        x.type === ColumnTypeTcdEnum.action)
                  );
                  if (found) {
                    configConverts.push({ ...found, isHide: x.isHide });
                  }
                });

                props.tableApi?.table?.setColumnConfigs?.(configConverts);
              }}
            ></ButtonTcd>
          </span>
          <TableTcd<TableConfigColumnMod>
            columnConfigs={formmMyState.watch("columnConfig")}
            data={formmMyState.watch("listdata")}
            height={CommonConst.table.heightDefault}
            columnKey="_colKey"
            sortableDefault={false}
            reorderableRows
            onRowReorder={(param) => {
              formmMyState.setValue("listdata", param.data ?? []);
            }}
          ></TableTcd>
        </div>
      </ContentTcd>
      <DevPopupHandleStateCpn
        onClick={() => {
          formmMyState.setValue("listdata", []);
          formmMyState.setValue("columnConfig", []);
          setTimeout(() => {
            formmMyState.setValue("listdata", [...listdata]);
            formmMyState.setValue("columnConfig", [...conlumnConfigsDefault]);
          }, 100);
        }}
      ></DevPopupHandleStateCpn>
    </ModalTcd>
  );
}
