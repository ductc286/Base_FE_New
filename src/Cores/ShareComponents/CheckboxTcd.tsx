import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { CSSProperties } from "react";

import { useCommonHelper } from "@src/Cores/Hooks";

import CommonHelper from "../Helpers/CommonHelper";
import { InputChangeModel } from "../Models/CommonModels";

export interface CheckboxTcdModel {
  value?: any;
  id?: string;
  name?: string;
  className?: string;
  style?: CSSProperties;
  error?: string;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  checked?: boolean;
  isInTable?: boolean;
  label?: string;

  onChange?: (params: InputChangeModel) => void;
}

export default function CheckboxTcd(props: CheckboxTcdModel) {
  const useCommonHelperState = useCommonHelper();
  const formId = props.id ?? useCommonHelperState.useGenerateFormId();
  const { value, id, className, readOnly, ...myprops } = props;
  myprops.disabled = props.readOnly ?? props.disabled;

  function onChange(e: CheckboxChangeEvent) {
    const eFake = {
      value: e.target.checked,
      target: { ...e.target, value: e.target.checked },
    };
    props.onChange?.(eFake);
  }

  return (
    <>
      {props.isInTable && (
        <input
          type="checkbox"
          defaultChecked={props.checked === true}
          disabled
        ></input>
      )}
      {!props.isInTable && (
        <span
          className={CommonHelper.concatClassNames(
            "flex align-items-center gap-1",
            props.className
          )}
        >
          <Checkbox
            inputId={formId}
            {...myprops}
            onChange={onChange}
            checked={props.value === true}
          ></Checkbox>
          <label htmlFor={formId}>{props.label}</label>
        </span>
      )}
    </>
  );
}
