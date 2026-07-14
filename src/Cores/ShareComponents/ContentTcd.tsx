import { CSSProperties, JSX } from "react";

import { CommonConst } from "@src/Cores/Constants";
import ButtonCloseTcd from "@src/Cores/ShareComponents/ButtonCloseTcd";

import CommonHelper from "../Helpers/CommonHelper";
import FormTcd from "./FormTcd";
import LoadingTcd from "./LoadingTcd";

interface IContentTcd {
  children?: any;
  title?: string | JSX.Element;
  isOpen?: boolean;
  isLoading?: boolean;
  className?: string;
  style?: CSSProperties;
  isAutocompleteForm?: boolean;
  isShowButtonExit?: boolean;
  isSticky?: boolean;
  onExit?: () => void;
}

export default function ContentTcd(props: Readonly<IContentTcd>) {
  const topHeight = `top-${CommonConst.heightTopFixed}`;
  return (
    <LoadingTcd isLoading={props.isLoading}>
      <FormTcd isAutocompleteForm={props.isAutocompleteForm}>
        <div
          className={CommonHelper.concatClassNames(
            "content-tcd",
            props.className
          )}
        >
          {props.title && (
            <div
              className={CommonHelper.concatClassNames(
                "content-header-tcd sticky z-10",
                topHeight
              )}
              style={
                props.isSticky ? { top: CommonConst.heightTopFixed } : undefined
              }
            >
              <h1 className="content-title-tcd">{props.title}</h1>
              {props.isShowButtonExit && (
                <ButtonCloseTcd
                  onClick={props.onExit}
                  className="absolute top-2 right-2"
                ></ButtonCloseTcd>
              )}
            </div>
          )}
          <div className="contcontentainer-body-tcd flex flex-col gap-3">
            {props.children}
          </div>
        </div>
      </FormTcd>
    </LoadingTcd>
  );
}
