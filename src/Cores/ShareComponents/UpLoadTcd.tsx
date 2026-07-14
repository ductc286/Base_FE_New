import { CSSProperties, Fragment, useRef } from "react";

import CommonConst from "../Constants/CommonConst";
import { SizeEnum } from "../Enums/CommonEnum";
import { InputChangeModel } from "../Models/CommonModels";
import ButtonTcd from "./ButtonTcd";

export interface UpLoadTcdModel {
  value?: string;
  id?: string;
  name?: string;
  className?: string;
  style?: CSSProperties;
  error?: string;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  type?: string;
  size?: SizeEnum;

  onChange?: (params: InputChangeModel) => void;
}

export default function UpLoadTcd(props: Readonly<UpLoadTcdModel>) {
  const inputElement = useRef<any>(undefined);
  const myProps: any = (({ value, ...o }) => o)(props);
  return (
    <Fragment>
      <input
        type="file"
        className="form-control-file"
        accept="image/png, image/jpeg"
        style={{ display: "none" }}
        value={props.value ?? ""}
        disabled={props.disabled}
        onChange={(event) => {
          props.onChange?.({
            value: event.target.files,
            event: event,
          });
        }}
        ref={inputElement}
      />
      <ButtonTcd
        text="Tải lên ảnh"
        disabled={props.disabled}
        color={CommonConst.classColor.secondary}
        icon={CommonConst.classIcon.upload}
        onClick={() => {
          inputElement.current.click();
        }}
        {...myProps}
      ></ButtonTcd>
    </Fragment>
  );
}
