import { JSX } from "react";

import ButtonShowHideTcd from "./ButtonShowHideTcd";
import CollapseTcd from "./CollapseTcd";

interface ICardTcd {
  children?: any;
  title?: string | JSX.Element;
  headerButtonRight?: JSX.Element;
  isOpen?: boolean;
  isShowIconOpen?: boolean;
  isNoBorder?: boolean;
  isCanCollapse?: boolean;

  onChangeOpen?: (isOpen?: boolean) => void;
}

export default function CardTcd(props: Readonly<ICardTcd>) {
  return (
    <div>
      <div className="card-tcd">
        {props.title && (
          <div className="card-header-tcd">
            <h2 className="card-title-tcd">{props.title}</h2>
            <div>
              {props.headerButtonRight}
              {props.isCanCollapse && props.isShowIconOpen !== false && (
                <ButtonShowHideTcd
                  isOpen={props.isOpen}
                  onClick={() => {
                    props.onChangeOpen?.(props.isOpen === false);
                  }}
                ></ButtonShowHideTcd>
              )}
            </div>
          </div>
        )}
        {props.isCanCollapse ? (
          <CollapseTcd isOpen={props.isOpen !== false}>
            <div className="tcd-card-body">{props.children}</div>
          </CollapseTcd>
        ) : (
          <div className="tcd-card-body">{props.children}</div>
        )}
      </div>
    </div>
  );
}
