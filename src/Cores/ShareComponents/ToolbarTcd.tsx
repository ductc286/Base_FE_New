import React from "react";

import { CommonConst } from "@src/Cores/Constants";
import { CommonHelper } from "@src/Cores/Helpers";

const ToolbarTcd = {
  Container: MyToolbarContainer,
  Left: MyToolbarLeft,
  Right: MyToolbarRight,
  ContainerCenter: MyToolbarContainerCenter,
};
export default ToolbarTcd;

export interface MyToolbarContainerModel {
  children?: any;
  className?: string;
  noBackground?: boolean;
  isStyleInCard?: boolean;
  isSticky?: boolean;
}
function MyToolbarContainer(props: MyToolbarContainerModel) {
  const myProps = (({ noBackground, isStyleInCard, ...o }) => o)(props);
  myProps.className =
    myProps.className === undefined
      ? "tcd-toolbar"
      : "tcd-toolbar " + myProps.className;
  if (props.noBackground === true) {
    myProps.className += " tcd-noBackground";
  }
  if (props.isStyleInCard === true) {
    myProps.className += " incard-tcd";
  }

  return (
    <div
      className={CommonHelper.concatClassNames(
        props.isSticky && "sticky z-10",
        props.className
      )}
      style={
        props.isSticky
          ? {
              top: CommonConst.heightTopFixed + CommonConst.heightTitleSticky,
            }
          : undefined
      }
    >
      <div {...myProps}></div>
    </div>
  );
}

function MyToolbarLeft(props: any) {
  const myProps = (({ ...o }) => o)(props);
  myProps.className =
    myProps.className === undefined
      ? "tcd-toolbar-left"
      : "tcd-toolbar-left " + myProps.className;
  return <div {...myProps}></div>;
}

function MyToolbarRight(props: any) {
  const myProps = (({ ...o }) => o)(props);
  myProps.className =
    myProps.className === undefined
      ? "tcd-toolbar-right"
      : "tcd-toolbar-right " + myProps.className;
  return <div {...myProps}></div>;
}

function MyToolbarContainerCenter(props: any) {
  return (
    <div
      className={CommonHelper.concatClassNames(
        "tcd-toolbarcenter",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
