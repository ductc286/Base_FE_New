import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

interface LinkTcdModel extends LinkProps {
  children: ReactNode;
  disabled?: boolean;
  isOffRedirect?: boolean; //Tắt sự kiện điều hướng khi click của thẻ <a>
  isOffUrlParam?: boolean;
}

export default function LinkTcd(props: LinkTcdModel) {
  const { isOffRedirect, isOffUrlParam, onClick, ...myProps } = props;

  function handleOnclick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    if (props.disabled || props.isOffRedirect) {
      e?.preventDefault();
    }
    if (!props.disabled) {
      props.onClick?.(e);
    }
  }

  return (
    <>
      {props.isOffUrlParam && <>{props.children}</>}
      {!props.isOffUrlParam && (
        <Link {...myProps} onClick={handleOnclick} className="flex">
          {props.children}
        </Link>
      )}
    </>
  );
}
