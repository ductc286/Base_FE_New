import { CSSProperties, useEffect, useMemo, useState } from "react";

import CommonConst from "../Constants/CommonConst";
import IconInputGroupTcd from "./IconInputGroupTcd";
import InputTextTcd from "./InputTextTcd";

export interface InputPasswordTcdModel {
  value?: string;
  id?: string;
  name?: string;
  className?: string;
  style?: CSSProperties;
  error?: string;
  placeholder?: string;
  readOnly?: boolean;

  isShowToggleView?: boolean;
  isViewPassword?: boolean;
  isSuggestPassword?: boolean;

  onToggleView?: () => void;
}

export default function InputPasswordTcd(
  props: Readonly<InputPasswordTcdModel>
) {
  const myProps = (({ isShowToggleView, isSuggestPassword, ...o }) => o)(props);
  const [isViewPassword, setIsViewPassword] = useState<boolean | undefined>(
    false
  );

  useEffect(() => {
    setIsViewPassword(props.isViewPassword);
  }, [props.isViewPassword]);

  const onToggleView = () => {
    setIsViewPassword(!isViewPassword);
    props.onToggleView?.();
  };

  const passwordClass = useMemo(
    () => (isViewPassword ? "" : "password"),
    [isViewPassword]
  );

  if (props.isSuggestPassword !== false)
    return (
      <div className="inputgroup-tcd p-inputgroup">
        <InputTextTcd
          {...myProps}
          type={isViewPassword ? "text" : "password"}
        />
        {props.isShowToggleView !== false && (
          <IconInputGroupTcd
            icon={
              isViewPassword === true
                ? CommonConst.classIcon.unView2
                : CommonConst.classIcon.view2
            }
            disabled={props.readOnly}
            onClick={onToggleView}
          ></IconInputGroupTcd>
        )}
      </div>
    );

  return (
    <div className="inputgroup-tcd p-inputgroup">
      <InputTextTcd {...myProps} className={passwordClass} />
      {props.isShowToggleView !== false && (
        <IconInputGroupTcd
          icon={
            isViewPassword === true
              ? CommonConst.classIcon.unView2
              : CommonConst.classIcon.view2
          }
          disabled={props.readOnly}
          onClick={onToggleView}
        ></IconInputGroupTcd>
      )}
    </div>
  );
}
