//#region imports
import { CSSProperties, JSX, Ref } from "react";

import {
  FormInputLayoutTypeEnum,
  InputTypeEnum,
} from "@src/Cores/Enums/CommonEnum";
import { InputChangeModel } from "@src/Cores/Models/CommonModels";
import {
  CheckboxTcd,
  DateTimeTcd,
  FormInputMesageTcd,
  InputContanerTcd,
  InputNumberTcd,
  InputPasswordTcd,
  InputTextAreaTcd,
  InputTextTcd,
  SelectTcd,
} from "@src/Cores/ShareComponents";
import { LabelInput } from "@src/Cores/ShareComponents/InputContanerTcd";
import { SelectDataModel } from "@src/Cores/Types/SelectDataModel";

//#endregion`

//#region models
interface FormGroupInputTcdModel {
  isShowRequired?: boolean;
  formLayout?: FormInputLayoutTypeEnum;
  inputType?: InputTypeEnum;
  error?: string;
  infoContent?: string | JSX.Element; //Nội dung cho icon i(chú thích cho ở label)

  label: string | JSX.Element;
  name: string;
  readOnly?: boolean;
  id?: string;
  value?: any;
  type?: string;
  autoComplete?: string;
  style?: CSSProperties;

  options?: SelectDataModel[];
  isMultiple?: boolean;
  showClear?: boolean;
  filter?: boolean;

  isShowToggleView?: boolean;
  isSuggestPassword?: boolean;

  onChange?: (e: InputChangeModel) => void;
  ref?: Ref<any>;
}
//#endregion

export default function FormGroupInputTcd(
  props: Readonly<FormGroupInputTcdModel>
) {
  const myProps: any = (({
    label,
    isShowRequired,
    formLayout,
    inputType,
    infoContent,
    isShowToggleView,
    ...o
  }) => o)(props);

  //#region render components
  function renderLabel() {
    return (
      <LabelInput
        label={props.label}
        inputType={props.inputType}
        infoContent={props.infoContent}
        id={props.id}
        isShowRequired={props.isShowRequired}
      ></LabelInput>
    );
  }

  function renderInput() {
    return (
      <>
        {(props.inputType === undefined ||
          props.inputType === InputTypeEnum.text) && (
          <InputTextTcd {...myProps} ref={props.ref} />
        )}
        {props.inputType === InputTypeEnum.dateTime && (
          <DateTimeTcd {...myProps}></DateTimeTcd>
        )}
        {props.inputType === InputTypeEnum.select && (
          <SelectTcd {...myProps}></SelectTcd>
        )}
        {props.inputType === InputTypeEnum.password && (
          <InputPasswordTcd
            {...myProps}
            isShowToggleView={props.isShowToggleView}
          ></InputPasswordTcd>
        )}
        {props.inputType === InputTypeEnum.number && (
          <InputNumberTcd {...myProps}></InputNumberTcd>
        )}
        {props.inputType === InputTypeEnum.checkbox && (
          <div
            className=""
            style={{ width: "100%", display: "block", padding: "10px 0" }}
          >
            <CheckboxTcd {...myProps} label={props.label}></CheckboxTcd>
          </div>
        )}
        {props.inputType === InputTypeEnum.textarea && (
          <InputTextAreaTcd {...myProps} />
        )}

        <FormInputMesageTcd error={props.error}></FormInputMesageTcd>
      </>
    );
  }
  //#endregion

  return (
    <InputContanerTcd
      formLayout={props.formLayout}
      label={renderLabel()}
      input={renderInput()}
    ></InputContanerTcd>
  );
}

//#end
