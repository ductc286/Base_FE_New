import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { JSX } from "react";

import { useCommonHelper } from "@src/Cores/Hooks";

interface IInputSwitchTcd {
  checked?: boolean;
  label?: string | JSX.Element;
  id?: string;

  onChange?: (event: InputSwitchChangeEvent) => void;
}

export default function InputSwitchTcd(props: IInputSwitchTcd) {
  const useCommonHelperState = useCommonHelper();
  const formId = props.id ?? useCommonHelperState.useGenerateFormId();

  return (
    <div className="flex items-center">
      <InputSwitch
        checked={props.checked === true}
        onChange={props?.onChange}
        inputId={formId}
      />
      {props.label && <label htmlFor={formId}>{props.label}</label>}
    </div>
  );
}
