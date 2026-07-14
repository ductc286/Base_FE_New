import {
  InputNumber,
  InputNumberChangeEvent,
  InputNumberProps,
} from "primereact/inputnumber";

import CommonConst from "../Constants/CommonConst";
import CommonHelper from "../Helpers/CommonHelper";
import { InputChangeModel } from "../Models/CommonModels";

interface InputNumberTcdModel extends InputNumberProps {
  separator?: boolean;
  error?: string;

  onPressEnter?: () => void;
  onChange: (params: InputChangeModel) => void;
}

export default function InputNumberTcd(props: InputNumberTcdModel) {
  const myProps = (({ onPressEnter, separator, className, ...o }) => o)(props);

  function onChange(e: InputNumberChangeEvent) {
    e.originalEvent.preventDefault();
    props.onChange?.({
      value: e.value,
      event: e,
    });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      props.onPressEnter?.();
    }
  }

  return (
    <div className="p-fluid">
      <InputNumber
        showButtons={props.showButtons !== false}
        {...myProps}
        useGrouping={props.separator === true}
        className={CommonHelper.concatClassNames(
          "w-full" + CommonConst.className.cssMaper,
          props.error ? CommonConst.className.inputInvalid : undefined,
          props.className
        )}
        inputClassName={CommonHelper.concatClassNames(
          "mapper-tcd",
          props.readOnly && "form-input-readonly-tcd"
        )}
        onChange={onChange}
        onKeyDown={onKeyDown}
        id={undefined}
        inputId={props.id}
        incrementButtonClassName={props.readOnly ? "disabled" : undefined}
        decrementButtonClassName={props.readOnly ? "disabled" : undefined}
      />
    </div>
  );
}
