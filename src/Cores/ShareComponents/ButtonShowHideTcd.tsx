import { CSSProperties } from "react";

import CommonConst from "../Constants/CommonConst";
import { SizeEnum } from "../Enums/CommonEnum";
import ButtonTcd from "./ButtonTcd";

interface ButtonShowHideTcdModel {
  isOpen?: boolean;
  className?: string;
  style?: CSSProperties;

  onClick?: () => void;
}

function ButtonShowHideTcd(props: Readonly<ButtonShowHideTcdModel>) {
  const icon = props.isOpen
    ? CommonConst.classIcon.cardZoomOut
    : CommonConst.classIcon.cardZoomIn;

  return (
    <ButtonTcd
      // isIconMode
      isNoBackground
      size={SizeEnum.small}
      icon={icon}
      style={props.style}
      className={props.className}
      onClick={props.onClick}
    ></ButtonTcd>
  );
}
export default ButtonShowHideTcd;
