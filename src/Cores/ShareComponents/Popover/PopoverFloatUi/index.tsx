import { PlacementEnum } from "@src/Cores/Enums/CommonEnum";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@src/Cores/ShareComponents/Popover/PopoverFloatUi/PopoverFloatUi";
import { PopoverTcdModel } from "@src/Cores/ShareComponents/Popover/PopoverTcd";

export default function PopoverFloatUi(props: PopoverTcdModel) {
  function getPlacement() {
    switch (props.placement) {
      case PlacementEnum.bottomStart:
        return "bottom-start";
      case PlacementEnum.bottomEnd:
        return "bottom-end";
      case PlacementEnum.right:
        return "right";

      default:
        return "bottom-start";
    }
  }

  return (
    <Popover
      open={props.isOpen}
      onOpenChange={props.onOpenChange}
      placement={getPlacement()}
    >
      <PopoverTrigger
        onClick={() => {
          props.onOpenChange?.(!props.isOpen);
        }}
      >
        {props.children}
      </PopoverTrigger>
      <PopoverContent className="popover-tcd">{props.content}</PopoverContent>
    </Popover>
  );
}
