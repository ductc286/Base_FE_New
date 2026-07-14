import { CSSProperties } from "react";

import CommonConst from "@src/Cores/Constants/CommonConst";

import ButtonTcd from "../ButtonTcd";
import LinkTcd from "../LinkTcd";

interface TableViewDetailTcdModel {
  children?: any;
  style?: CSSProperties;
  className?: string;
  isFullWidth?: boolean;
  href?: string;

  onClick?: () => void;
}

export default function TableViewDetailTcd(
  props: Readonly<TableViewDetailTcdModel>
) {
  return (
    <div className="" style={{ display: "inline-block" }}>
      <div className="flex px-1">
        <LinkTcd
          href={props.href ?? ""}
          onClick={() => {
            props.onClick?.();
          }}
          isOffRedirect
        >
          {/* <Button label="Small" icon="pi pi-check" size="small" style={{height: "15px", width: "15px"}}/> */}
          <ButtonTcd
            tooltip={CommonConst.title.viewDetail}
            icon={CommonConst.classIcon.view}
            color={CommonConst.classColor.info}
            isNoBackground
            isIconMode
          ></ButtonTcd>
        </LinkTcd>
      </div>
    </div>
  );
  // return (
  //   <LinkTcd
  //     href={props.href ?? ""}
  //     onClick={() => {
  //       props.onClick?.();
  //     }}
  //     isOffRedirect
  //   >
  //     <ButtonTcd
  //       tooltip={CommonConst.title.viewDetail}
  //       icon={CommonConst.classIcon.view}
  //       color={CommonConst.classColor.info}
  //       isNoBackground
  //       isIconMode
  //     ></ButtonTcd>
  //   </LinkTcd>
  // );
}
