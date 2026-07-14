import { InputTextarea } from "primereact/inputtextarea";
import { CSSProperties } from "react";

import CommonHelper from "../Helpers/CommonHelper";
import { InputChangeModel } from "../Models/CommonModels";

export interface InputTextAreaTcdModel {
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
}

export default function InputTextAreaTcd(props: InputTextAreaTcdModel) {
  return (
    <InputTextarea
      {...props}
      value={props.value ?? ""}
      className={CommonHelper.concatClassNames(
        "w-full",
        props.className,
        props.readOnly ? "form-input-readonly-tcd" : undefined
      )}
      rows={5}
      onChange={(e) => {
        props.onChange?.({
          value: e.target.value,
          event: e,
        });
      }}
    />
  );
}
