import CommonHelper from "../Helpers/CommonHelper";
import ButtonTcd from "./ButtonTcd";
import { IconTcdModel } from "./IconTcd";

export default function IconInputGroupTcd(props: Readonly<IconTcdModel>) {
  return (
    <ButtonTcd
      icon={props.icon}
      className={CommonHelper.concatClassNames(
        "input-icon-tcd",
        props.className
      )}
      disabled={props.disabled}
      onClick={props.onClick}
    ></ButtonTcd>
  );
}
