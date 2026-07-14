import { JSX } from "react";

import { FormInputLayoutTypeEnum } from "@src/Cores/Enums/CommonEnum";
import {
  FormInputMesageTcd,
  InputContanerTcd,
} from "@src/Cores/ShareComponents";
import { LabelInput } from "@src/Cores/ShareComponents/InputContanerTcd";

import DateTextTcd, { IDateTextTcd } from "./DateTextTcd";

interface FormGroupDateTextTcdModel extends IDateTextTcd {
  isShowRequired?: boolean;
  formLayout?: FormInputLayoutTypeEnum;
  error?: string;
  status?: any;

  label: any;
  name: string;
  readOnly?: boolean;
  id?: string;
  value?: any;
  type?: string;
  autoComplete?: string;
  style?: any;

  infoContent?: string | JSX.Element; //Nội dung cho icon i(chú thích cho ở label)
}

export default function FormGroupDateTextTcd(props: FormGroupDateTextTcdModel) {
  const myProps: any = (({ label, isShowRequired, formLayout, ...o }) => o)(
    props
  );

  return (
    <InputContanerTcd
      formLayout={props.formLayout}
      label={
        <LabelInput
          label={props.label}
          infoContent={props.infoContent}
          id={props.id}
          isShowRequired={props.isShowRequired}
        ></LabelInput>
      }
      input={
        <>
          <DateTextTcd {...myProps}></DateTextTcd>
          <FormInputMesageTcd error={props.error}></FormInputMesageTcd>
        </>
      }
    ></InputContanerTcd>
  );
}
