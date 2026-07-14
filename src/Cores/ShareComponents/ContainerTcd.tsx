import { CSSProperties } from "react";

import { SizeEnum } from "@src/Cores/Enums/CommonEnum";
import { CommonHelper } from "@src/Cores/Helpers";

interface IContainerTcd {
  children?: any;
  style?: CSSProperties;
  className?: string;
  isCenter?: boolean;
  size?: SizeEnum;
}

export default function ContainerTcd(props: Readonly<IContainerTcd>) {
  const classBySize = CommonHelper.getSizeClassName(props.size);
  return (
    <div
      className={CommonHelper.concatClassNames(
        "container-fluid-tcd",
        props.isCenter && "align-items-center"
      )}
    >
      <div
        style={props.style}
        className={CommonHelper.concatClassNames(
          "container-tcd",
          classBySize,
          props.className
        )}
      >
        {props.children}
      </div>
    </div>
  );
}

// export default function ContainerTcd(props: Readonly<IContainerTcd>) {
//   return <div>{props.children}</div>;
// }
