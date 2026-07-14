import { ReactNode, useState } from "react";

import CommonConst from "../Constants/CommonConst";
import ButtonTcd from "./ButtonTcd";
import DividerTcd from "./DividerTcd";
import InputSwitchTcd from "./InputSwitchTcd";

interface DivFilterTcdModel {
  className?: string;
  children: ReactNode;
  onApply: () => void;
  onReset?: () => void;
  onHideFilter?: () => void;
}

export default function DivFilterTcd(props: Readonly<DivFilterTcdModel>) {
  const [isCloseFilterAfterApply, setIsCloseFilterAfterApply] =
    useState<boolean>(false);

  return (
    <div className="tcd-filter">
      {props.children}
      <DividerTcd />

      <div className="w-full flex flex-row gap-2 items-center flex-wrap">
        <ButtonTcd
          text="Áp dụng"
          icon={CommonConst.classIcon.check}
          color={CommonConst.classColor.success}
          onClick={() => {
            props.onApply();

            setTimeout(() => {
              isCloseFilterAfterApply && props.onHideFilter?.();
            }, 300);
          }}
        ></ButtonTcd>
        <ButtonTcd
          text="Nhập lại"
          icon={CommonConst.classIcon.reset}
          color={CommonConst.classColor.primary}
          onClick={props.onReset}
        ></ButtonTcd>
        <InputSwitchTcd
          checked={isCloseFilterAfterApply}
          label={<i>Đóng bộ lọc sau khi áp dụng</i>}
          onChange={() => {
            setIsCloseFilterAfterApply(!isCloseFilterAfterApply);
          }}
        />
      </div>
    </div>
  );
}
