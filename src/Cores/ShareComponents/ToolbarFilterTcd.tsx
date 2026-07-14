import { JSX, ReactNode } from "react";

import { CommonConst } from "@src/Cores/Constants";
import ButtonHideFilterTcd from "@src/Cores/ShareComponents/ButtonHideFilterTcd";
import ButtonTcd from "@src/Cores/ShareComponents/ButtonTcd";
import CollapseTcd from "@src/Cores/ShareComponents/CollapseTcd";
import DivFilterTcd from "@src/Cores/ShareComponents/DivFilterTcd";
import InputTextTcd from "@src/Cores/ShareComponents/InputTextTcd";
import SelectTcd from "@src/Cores/ShareComponents/SelectTcd";
import ToolbarTcd from "@src/Cores/ShareComponents/ToolbarTcd";
import { SelectDataModel } from "@src/Cores/Types/SelectDataModel";

interface ToolbarFilterTcdModel {
  className?: string;
  searchKeyword?: string;
  searchColumn?: string;
  filterExtend?: JSX.Element;
  filterTypeOptions?: SelectDataModel[];
  isOpen?: boolean;
  isShowButtonAdd?: boolean;
  rightComponent?: ReactNode;
  isStyleInCard?: boolean;

  onSearch: () => void;
  onResetFilter?: () => void;
  onOpenChange?: (isOpen?: boolean) => void;
  onFilterChange: (property: string, value: any) => void;
  onAddClick?: () => void;
}

export default function ToolbarFilterTcd(
  props: Readonly<ToolbarFilterTcdModel>
) {
  return (
    <div className="flex flex-col gap-2">
      <ToolbarTcd.Container isStyleInCard={props.isStyleInCard}>
        <ToolbarTcd.Left>
          <div className="max-w-full sm:w-64">
            <InputTextTcd
              placeholder="Nhập tìm kiếm..."
              value={props.searchKeyword}
              onPressEnter={() => props.onSearch()}
              onChange={(e: any) =>
                props.onFilterChange("searchKeyword", e.value)
              }
            ></InputTextTcd>
          </div>
          <div className="">
            <label>Tìm kiếm theo</label>
          </div>
          <div className="max-w-full sm:w-64">
            <SelectTcd
              options={props.filterTypeOptions}
              onChange={(e: any) =>
                props.onFilterChange("searchColumn", e.value)
              }
              value={props.searchColumn}
            />
          </div>
          <ButtonTcd
            text="Tìm kiếm"
            icon={CommonConst.classIcon.search}
            color={CommonConst.classColor.primary}
            onClick={() => props.onSearch()}
          ></ButtonTcd>
          {props.filterExtend && (
            <ButtonHideFilterTcd
              color={CommonConst.classColor.secondary}
              isOpen={props.isOpen}
              onClick={() => props.onOpenChange?.(!props.isOpen)}
            />
          )}
          <ButtonTcd
            text="Nhập lại"
            icon={CommonConst.classIcon.reset}
            color={CommonConst.classColor.secondary}
            onClick={() => props.onResetFilter?.()}
          ></ButtonTcd>
        </ToolbarTcd.Left>
        <ToolbarTcd.Right>
          {props.isShowButtonAdd && (
            <ButtonTcd
              text="Thêm mới"
              icon={CommonConst.classIcon.add}
              color={CommonConst.classColor.primary}
              onClick={props.onAddClick}
            ></ButtonTcd>
          )}
          {props.rightComponent}
        </ToolbarTcd.Right>
      </ToolbarTcd.Container>

      {props?.filterExtend && (
        <CollapseTcd isOpen={props.isOpen === true}>
          <DivFilterTcd
            onApply={() => props.onSearch()}
            onHideFilter={() => props.onOpenChange?.(false)}
            onReset={props?.onResetFilter}
          >
            {props?.filterExtend}
          </DivFilterTcd>
        </CollapseTcd>
      )}
    </div>
  );
}
