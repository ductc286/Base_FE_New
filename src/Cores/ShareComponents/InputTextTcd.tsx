import { InputText } from "primereact/inputtext";
import { ChangeEvent, CSSProperties } from "react";

import CommonConst from "../Constants/CommonConst";
import CommonHelper from "../Helpers/CommonHelper";
import { InputChangeModel } from "../Models/CommonModels";

export interface InputTextTcdModel {
  value?: string;
  id?: string;
  name?: string;
  className?: string;
  style?: CSSProperties;
  error?: string;
  placeholder?: string;
  readOnly?: boolean;
  type?: string;

  onChange?: (params: InputChangeModel) => void;
  onPressEnter?: (params: InputChangeModel) => void;
}

export default function InputTextTcd(props: Readonly<InputTextTcdModel>) {
  const myProps = (({ onPressEnter, ...o }) => o)(props);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    // e.preventDefault();
    // props.onChange?.({ ...e, value: e.target.value });
    props.onChange?.({ value: e.target.value, event: e });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      props.onPressEnter?.({ event: e });
    }
  }

  return (
    <InputText
      {...myProps}
      className={CommonHelper.concatClassNames(
        props.className,
        CommonConst.className.cssMaper,
        "w-full",
        props.readOnly ? "form-input-readonly-tcd" : undefined,
        props.error && CommonConst.className.inputInvalid
      )}
      value={props.value ?? ""}
      onChange={onChange}
      onKeyDown={onKeyDown}
    ></InputText>
  );
}
