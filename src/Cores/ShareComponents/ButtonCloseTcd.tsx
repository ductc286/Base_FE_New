import { CSSProperties } from "react";

import { CommonConst } from "@src/Cores/Constants";
import ButtonTcd from "@src/Cores/ShareComponents/ButtonTcd";

interface ButtonCloseTcdModel {
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export default function ButtonCloseTcd(props: ButtonCloseTcdModel) {
  return (
    <ButtonTcd
      icon={CommonConst.classIcon.close}
      onClick={props.onClick}
      isNoBackground
      isRounded
      className={props.className}
      style={props.style}
    ></ButtonTcd>
  );
}
