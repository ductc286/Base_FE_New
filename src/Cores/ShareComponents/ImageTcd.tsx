import { Image } from "primereact/image";
import { CSSProperties, useMemo } from "react";
import CommonHelper from "src/Cores/Helpers/CommonHelper";

import CheckTypeHelper from "../Helpers/CheckTypeHelper";

interface ImageTcdModel {
  src?: string;
  alt?: string;
  preview?: boolean;
  height?: string | number;
  width?: string | number;
  style?: CSSProperties;
}

export default function ImageTcd(props: ImageTcdModel) {
  const height = useMemo(() => {
    if (CommonHelper.isNullOrEmpty(props.height)) {
      return undefined;
    }
    if (CheckTypeHelper.isNumber(props.height)) {
      return `${props.height}px`;
    }
    return `${props.height}`;
  }, []);

  const width = useMemo(() => {
    if (CommonHelper.isNullOrEmpty(props.width)) {
      return undefined;
    }
    if (CheckTypeHelper.isNumber(props.width)) {
      return `${props.width}px`;
    }
    return `${props.width}`;
  }, []);

  return (
    <>
      <Image
        src={CommonHelper.getAbsolutePath(props.src)}
        preview={props.preview}
        alt={props.alt}
        height={height}
        width={width}
      ></Image>
    </>
  );
}
