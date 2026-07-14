import { useEffect, useState } from "react";

import CommonHelper from "../Helpers/CommonHelper";

interface ITabContentTcd {
  children?: any;
  activeTab?: string | number;
  className?: string;
}

function TabContent(props: Readonly<ITabContentTcd>) {
  return (
    <div
      className={CommonHelper.concatClassNames(
        "tab-content-tcd",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

interface ITabPanelTcd {
  children?: any;
  activeTab?: string | number;
  tabId?: string | number;
}
function TabPanel(props: Readonly<ITabPanelTcd>) {
  const [isHasbeenActive, setIsHasbeenActive] = useState(false); //Đánh dấu xem đã được active lần nào chưa, tránh render lần đầu nếu không phải tab active
  useEffect(() => {
    if (props.activeTab === props.tabId && !isHasbeenActive) {
      setIsHasbeenActive(true);
    }
  }, [props.activeTab]);

  const style =
    props.activeTab === props.tabId ? undefined : { display: "none" };
  return (
    <div className="tab-panel-tcd" style={style}>
      {isHasbeenActive && props.children}
    </div>
  );
}

const TabTcd = {
  TabContent,
  TabPanel,
};
export default TabTcd;
