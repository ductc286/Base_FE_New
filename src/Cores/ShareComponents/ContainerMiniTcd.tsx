import { CSSProperties, ReactNode } from "react";

import { CommonHelper } from "@src/Cores/Helpers";
import { ButtonCloseTcd, FormTcd } from "@src/Cores/ShareComponents";

interface IContainerMiniTcd {
  children?: ReactNode;
  title?: ReactNode;
  isShowIconClose?: boolean;
  className?: string;
  style?: CSSProperties;
  isMargin?: boolean;
  isAutocompleteForm?: boolean;

  onClose?: () => void;
}

export default function ContainerMiniTcd(props: Readonly<IContainerMiniTcd>) {
  return (
    <FormTcd isAutocompleteForm={props.isAutocompleteForm}>
      <div
        style={{ background: "white" }}
        className={CommonHelper.concatClassNames(
          props.className,
          "p-4 rounded",
          props.isMargin && "m-4"
        )}
      >
        {props.title && (
          <div
            className="card-header-tcd"
            style={{
              paddingLeft: "unset",
              paddingRight: "unset",
              borderRadius: "0",
            }}
          >
            <h2 className="card-title-tcd">{props.title}</h2>
            <div>
              {props.isShowIconClose && (
                <ButtonCloseTcd onClick={props.onClose}></ButtonCloseTcd>
              )}
            </div>
          </div>
        )}

        <div style={{ paddingTop: "14px" }}>{props.children}</div>
      </div>
    </FormTcd>
  );
}
