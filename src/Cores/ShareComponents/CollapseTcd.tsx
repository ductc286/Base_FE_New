import { useEffect, useRef, useState } from "react";

import { CommonHelper } from "@src/Cores/Helpers";

interface ICollapseTcd {
  children: any;
  isOpen?: boolean;
}

export default function BasicDemo(props: ICollapseTcd) {
  const timerContainer = useRef<NodeJS.Timeout | undefined>(undefined);
  const timerWrapper = useRef<NodeJS.Timeout | undefined>(undefined);

  const [isOpenContainer, setIsOpenContainer] = useState(props.isOpen != false);
  const [isOpenWrapper, setIsOpenWrapper] = useState(props.isOpen != false);
  useEffect(() => {
    if (props.isOpen != false) {
      clearTimeout(timerContainer.current);
      setIsOpenContainer(true);
      timerWrapper.current = setTimeout(() => setIsOpenWrapper(true), 20);
    } else {
      setIsOpenWrapper(false);
      timerContainer.current = setTimeout(() => setIsOpenContainer(false), 200);
    }
  }, [props.isOpen]);

  return (
    <>
      <div
        className={CommonHelper.concatClassNames(!isOpenContainer && "hidden")}
      >
        <div
          className={CommonHelper.concatClassNames(
            "wrapper",
            isOpenWrapper && "is-open"
          )}
        >
          <div className="expandable">{props?.children}</div>
        </div>
      </div>
    </>
  );
}
