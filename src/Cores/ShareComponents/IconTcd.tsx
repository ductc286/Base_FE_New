// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dynamic from "next/dynamic";
import { CSSProperties } from "react";

import CommonHelper from "../Helpers/CommonHelper";
const FontAwesomeIcon = dynamic(
  () =>
    import("@fortawesome/react-fontawesome").then((mod) => mod.FontAwesomeIcon),
  {
    ssr: false,
  }
);

export interface IconTcdModel {
  icon?: string;
  className?: string;
  style?: CSSProperties;
  color?: string;
  disabled?: boolean;

  onClick?: (e?: any) => void;
}

function isfortawesome(icon: string) {
  return icon.startsWith("fa");
}
export default function IconTcd(props: IconTcdModel) {
  if (props.icon && isfortawesome(props.icon)) {
    return (
      <FontAwesomeIcon
        icon={props.icon as any}
        className={props.className}
        style={props.style}
        onClick={props.onClick}
      />
    );
  }
  if (props.icon)
    return (
      <i
        className={CommonHelper.concatClassNames(props.icon, props.className)}
        style={props.style}
        onClick={props.onClick}
      />
    );
  return <></>;
}
