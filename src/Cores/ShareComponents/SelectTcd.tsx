import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { CSSProperties, useMemo } from "react";

import { SelectDataModel } from "@src/Cores/Types/SelectDataModel";

import CommonHelper from "../Helpers/CommonHelper";
import { InputChangeModel } from "../Models/CommonModels";

export interface SelectTcdModel {
  value?: any;
  id?: string;
  name?: string;
  className?: string;
  style?: CSSProperties;
  error?: string;
  placeholder?: string;
  readOnly?: boolean;

  options?: SelectDataModel[];
  isMultiple?: boolean;
  showClear?: boolean;
  filter?: boolean;

  onChange?: (params: InputChangeModel) => void;
}

export default function SelectTcd(props: SelectTcdModel) {
  if (props.isMultiple)
    return <SelectTcdMultiple {...props}></SelectTcdMultiple>;
  return <SelectTcdSingle {...props}></SelectTcdSingle>;
}

function SelectTcdMultiple(props: SelectTcdModel) {
  const myProps: any = (({ isMultiple, ...o }) => o)(props);

  const value = useMemo(() => {
    const result = props.options?.filter((x: any) =>
      props.value?.some((y: any) => y === x.value)
    );
    return result;
  }, [props.value, props.options]);
  return (
    <MultiSelect
      {...myProps}
      disabled={props.readOnly}
      value={value}
      useOptionAsValue={true}
      className={CommonHelper.concatClassNames(
        props.readOnly ? "form-input-readonly-tcd" : undefined,
        "w-full mapper-tcd",
        props.className
      )}
      onChange={(e) => {
        const newValue = e.value?.map(function (item: any) {
          return item?.value;
        });
        const valueFake: InputChangeModel = {
          value: newValue,
          event: e,
        };
        props.onChange?.(valueFake);
      }}
      maxSelectedLabels={3}
      showClear={false}
    ></MultiSelect>
  );
}

function SelectTcdSingle(props: SelectTcdModel) {
  const myProps: any = (({ isMultiple, ...o }) => o)(props);

  return (
    <Dropdown
      {...myProps}
      disabled={props.readOnly}
      className={CommonHelper.concatClassNames(
        props.readOnly ? "form-input-readonly-tcd" : undefined,
        "w-full",
        props.className
      )}
      onChange={(e) => {
        const valueFake: InputChangeModel = {
          value: e.target.value,
          event: e,
        };
        props.onChange?.(valueFake);
      }}
    ></Dropdown>
  );
}
