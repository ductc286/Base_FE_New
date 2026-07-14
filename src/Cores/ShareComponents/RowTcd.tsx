import { CSSProperties } from "react";

import CommonHelper from "@src/Cores/Helpers/CommonHelper";

interface RowTcdModel {
  children?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function RowTcd(props: RowTcdModel) {
  return (
    // <div {...props} className="grid grid-cols-12 gap-x-4 gap-y-2 items-start">

    <div
      {...props}
      className={CommonHelper.concatClassNames(
        "grid grid-cols-12 w-full gap-2 py-1",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
