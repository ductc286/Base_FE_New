import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { CSSProperties } from "react";

import { InputChangeModel } from "../Models/CommonModels";

export interface RadioButtonTcdModel {
  value?: any;
  id?: string;
  name?: string;
  className?: string;
  style?: CSSProperties;
  error?: string;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  label?: string;

  onChange?: (params: InputChangeModel) => void;
}

export default function RadioButtonTcd(props: RadioButtonTcdModel) {
  const { value, id, readOnly, ...myprops } = props;
  myprops.disabled = props.readOnly ?? props.disabled;

  function onChange(e: RadioButtonChangeEvent) {
    e.preventDefault();
    const eFake = {
      value: e.checked,
      event: e,
    };
    props.onChange?.(eFake);
  }

  return (
    <span className="flex align-items-center gap-1">
      <RadioButton
        inputId={props.id}
        {...myprops}
        onChange={onChange}
        checked={props.value === true}
      ></RadioButton>
      <label htmlFor={props.id}>{props.label}</label>
    </span>
  );
}
