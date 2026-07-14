import { JSX } from "react";

import CommonConst from "../Constants/CommonConst";
import IconOnlyTcd from "./IconOnlyTcd";
import TooltipTcd from "./TooltipTcd";

function InfoIconTcd({
  title,
}: {
  title: JSX.Element | string | undefined | null;
}) {
  return (
    <>
      <TooltipTcd title={title}>
        <IconOnlyTcd
          icon={CommonConst.classIcon.info}
          style={{ color: CommonConst.color.black }}
        ></IconOnlyTcd>
      </TooltipTcd>
    </>
  );
}
export default InfoIconTcd;
