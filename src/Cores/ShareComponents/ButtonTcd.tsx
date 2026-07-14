import { Button, ButtonProps } from "primereact/button";
import { CSSProperties, JSX, useEffect, useState } from "react";

import CommonConst from "../Constants/CommonConst";
import { SizeEnum } from "../Enums/CommonEnum";
import CommonHelper from "../Helpers/CommonHelper";
import IconTcd from "./IconTcd";
import TooltipTcd from "./TooltipTcd";

export interface ButtonTcdModel
  extends Omit<
    ButtonProps,
    "icon" | "text" | "size" | "tooltip" | "isNoBackground"
  > {
  text?: string;
  icon?: string;
  color?: string;
  className?: string;
  style?: CSSProperties;
  size?: SizeEnum;
  tooltip?: string | JSX.Element;
  isLoading?: boolean;
  disabled?: boolean;
  isNoBackground?: boolean;
  isRounded?: boolean;
  isIconMode?: boolean;
  id?: string;

  onClick?: (event: any) => void;
}

export default function ButtonTcd(props: ButtonTcdModel) {
  const [myisLoading, setMyisLoading] = useState<boolean>();

  useEffect(() => {
    if (props.isLoading) {
      setMyisLoading(true);
    } else {
      setTimeout(() => {
        setMyisLoading(false);
      }, 200);
    }
  }, [props.isLoading]);

  function fun_onClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    props.onClick?.(event);
  }

  // const { password, ...props } = user;

  const {
    text,
    icon,
    severity,
    loading,
    disabled,
    onClick,
    className,
    rounded,
    style,
    id,
    isNoBackground,
    tooltip,
    isRounded,
    isIconMode,
    isLoading,
    ...propsPrime
  } = props;
  //#region private components
  function getButtonReturn() {
    return (
      <Button
        {...(propsPrime as any)}
        label={props.text}
        severity={props.color as any}
        loading={myisLoading}
        disabled={props.disabled || myisLoading}
        icon={IconPrivate(props)}
        onClick={fun_onClick}
        text={props.isNoBackground}
        className={CommonHelper.concatClassNames(
          CommonConst.className.cssMaper,
          props.isIconMode && "buttonicon-tcd",
          props.size !== undefined
            ? CommonHelper.getSizeClassName(props.size)
            : undefined,
          props.className
        )}
        rounded={props.isRounded}
        style={props.style}
        id={props.id}
      />
    );
  }
  //#endregion
  if (props.tooltip) {
    return <TooltipTcd title={props.tooltip}>{getButtonReturn()}</TooltipTcd>;
  }
  return getButtonReturn();
}

function IconPrivate(props: any) {
  return props.icon ? (
    <IconTcd
      className={CommonHelper.concatClassNames(
        "p-button-icon p-button-icon-left"
      )}
      icon={props.icon}
    ></IconTcd>
  ) : undefined;
}
