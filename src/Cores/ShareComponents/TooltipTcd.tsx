import { Tooltip } from "primereact/tooltip";
import React, { JSX } from "react";

import { CheckTypeHelper, CommonHelper } from "@src/Cores/Helpers";
import { useCommonHelper } from "@src/Cores/Hooks";

function TooltipTcd({
  children,
  title,
}: Readonly<{
  children: React.ReactElement;
  title: JSX.Element | string | undefined | null;
}>) {
  const useCommonHelperState = useCommonHelper();
  const formId = useCommonHelperState.useGenerateFormId();

  const childConvert = children as any;
  const childWithProps = React.cloneElement(childConvert, {
    className: CommonHelper.concatClassNames(
      childConvert?.props?.className,
      formId
    ),
  });
  return (
    <>
      {CheckTypeHelper.isString(children) ? (
        <span className={formId}>{children}</span>
      ) : (
        childWithProps
      )}
      <Tooltip target={"." + formId} position="top" autoHide={true}>
        {title}
      </Tooltip>
    </>
  );
}
export default TooltipTcd;
