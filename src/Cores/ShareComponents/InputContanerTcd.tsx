import { JSX, ReactNode } from "react";

import {
  FormInputLayoutTypeEnum,
  InputTypeEnum,
} from "@src/Cores/Enums/CommonEnum";
import InfoIconTcd from "@src/Cores/ShareComponents/InfoIconTcd";
import IsRequiredInputTcd from "@src/Cores/ShareComponents/IsRequiredInputTcd";

export default function InputContanerTcd({
  formLayout,
  label,
  input,
}: {
  formLayout?: FormInputLayoutTypeEnum;
  label?: ReactNode;
  input?: ReactNode;
}) {
  return (
    <>
      {/* layout dọc */}
      {(formLayout === undefined ||
        formLayout === FormInputLayoutTypeEnum.vertical) && (
        <div className="flex flex-col gap-2">
          <div>{label}</div>
          <div>{input}</div>
        </div>
      )}

      {/* layout ngang */}
      {formLayout === FormInputLayoutTypeEnum.horizontal && (
        <div className="flex gap-2">
          <div className="flex flex-1">{label}</div>
          <div className="flex flex-auto">{input}</div>
        </div>
      )}
    </>
  );
}

export function LabelInput({
  label,
  inputType,
  infoContent,
  id,
  isShowRequired,
}: {
  label?: any;
  inputType?: InputTypeEnum;
  infoContent?: string | JSX.Element;
  id?: string;
  isShowRequired?: boolean;
}) {
  if (inputType === InputTypeEnum.checkbox) {
    return (
      <div className="flex align-items-center gap-2">
        <label
          className="flex align-items-center"
          htmlFor={id}
          style={{ height: "18px" }}
        ></label>
        {isShowRequired && <IsRequiredInputTcd></IsRequiredInputTcd>}
        {infoContent && <InfoIconTcd title={infoContent} />}
      </div>
    );
  }
  return (
    <div className="flex align-items-center gap-2">
      <label
        className="flex align-items-center"
        htmlFor={id}
        style={{ height: "18px" }}
      >
        {label}
      </label>
      {isShowRequired && <IsRequiredInputTcd></IsRequiredInputTcd>}
      {infoContent && <InfoIconTcd title={infoContent} />}
    </div>
  );
}
