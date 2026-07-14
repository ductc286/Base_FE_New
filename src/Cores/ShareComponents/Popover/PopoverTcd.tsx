import { Popover } from "antd";
import { JSX, ReactNode } from "react";

import { PlacementEnum } from "@src/Cores/Enums/CommonEnum";
import PopoverFloatUi from "@src/Cores/ShareComponents/Popover/PopoverFloatUi";

export interface PopoverTcdModel {
  children?: ReactNode;
  content?: JSX.Element;

  isOpen?: boolean;
  placement?: PlacementEnum;
  popupContainerClassName?: string;
  onOpenChange?: (isOpen?: boolean) => void;
}

export default function PopoverTcd(props: PopoverTcdModel) {
  return (
    <Popover
      content={props.content}
      trigger="click"
      placement="bottomLeft"
      open={props.isOpen}
      rootClassName={props.popupContainerClassName}
      onOpenChange={props.onOpenChange}
    >
      {props.children}
    </Popover>
  );

  return <PopoverFloatUi {...props}></PopoverFloatUi>;
}
