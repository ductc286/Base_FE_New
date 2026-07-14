import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { ReactNode, useMemo, useState } from "react";

import { PlacementEnum } from "@src/Cores/Enums/CommonEnum";
import { ListItemModel } from "@src/Cores/Models/CommonModels";
import IconTcd from "@src/Cores/ShareComponents/IconTcd";
import PopoverTcd from "@src/Cores/ShareComponents/Popover/PopoverTcd";

interface PopoverTcdModel {
  children?: ReactNode;
  listItem: ListItemModel[];
  placement?: PlacementEnum;
}

export default function PopoverOptionTcd(props: Readonly<PopoverTcdModel>) {
  const [isOpen, setIsOpen] = useState<boolean | undefined>(false);

  const listDataConvert = useMemo(() => {
    const result = props.listItem
      .filter((x) => !x.isHide)
      .map((x) => {
        const itemRes: MenuItem = {
          label: x.label,
          icon: x.icon ? (
            <IconTcd className="p-menuitem-icon" icon={x.icon}></IconTcd>
          ) : undefined,
          command: (event) => {
            event.originalEvent.preventDefault();
            setIsOpen(false);
            x.onclick?.();
          },
          template: x.render ? () => x.render : undefined,
          separator: x.isSeparator,
          url: x.url,
        };
        return itemRes;
      });
    return result;
  }, [props.listItem]);

  const contentFake = (
    <Menu model={listDataConvert} style={{ width: "auto" }} />
  );
  return (
    <>
      <PopoverTcd
        content={contentFake}
        isOpen={isOpen}
        placement={props.placement}
        onOpenChange={setIsOpen}
      >
        {props.children}
      </PopoverTcd>
    </>
  );
}
