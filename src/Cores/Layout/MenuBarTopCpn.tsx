import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import { useEffect, useMemo, useState } from "react";

import CommonHelper from "@src/Cores/Helpers/CommonHelper";
import HeaderRight from "@src/Cores/Layout/HeaderRight";
import { ListItemModel } from "@src/Cores/Models/CommonModels";
import CoreMenuService, {
  CoreMenuEntity,
} from "@src/Cores/Services/Admin/CoreMenuService";
import { IconTcd, ImageTcd, LinkTcd } from "@src/Cores/ShareComponents";

export default function MenuBarTopCpn() {
  const router = useRouter();
  const pathname = usePathname();
  const [listMenu, setListMenu] = useState<ListItemModel[]>([]);
  useEffect(() => {
    //Lấy và map thông tin menu từ server
    CoreMenuService.GetListMenuAdmin().then((res) => {
      if (res.isSuccess) {
        const menuData = convertMenuModel(res.data);
        setListUrlActive(menuData);
        setListMenu(menuData);
      }
    });
  }, []);

  const convertMenuActive = (par_listMenu?: ListItemModel[]) => {
    let result: string[] = [];
    par_listMenu?.forEach((menuItem: ListItemModel) => {
      if (menuItem.url) {
        result.push(menuItem.url);
      }
      if (!CommonHelper.isNullOrEmpty(menuItem.items)) {
        result.push(...convertMenuActive(menuItem.items));
      }
    });
    return result;
  };

  const fun_getActiveClass = (item: ListItemModel) => {
    return item.listUrlActive?.includes(pathname)
      ? CommonHelper.concatClassNames(item.className, "tcd-menu-active")
      : item.className;
  };

  const setListUrlActive = (par_listMenu?: ListItemModel[]) => {
    par_listMenu?.forEach((menuItem) => {
      const listUrlTemp = [menuItem.url].concat(
        convertMenuActive(menuItem.items)
      );
      menuItem.listUrlActive = listUrlTemp.filter((x) => x);
      setListUrlActive(menuItem.items);
    });
  };

  const fun_refreshActive = (par_listMenu?: ListItemModel[]) => {
    par_listMenu?.forEach((menuItem) => {
      menuItem.className = fun_getActiveClass(menuItem);
      fun_refreshActive(menuItem.items);
    });
  };

  const convertMenuModel = (par_listMenu?: CoreMenuEntity[]) => {
    let result: ListItemModel[] = [];
    par_listMenu?.forEach((menuItem: CoreMenuEntity) => {
      const menuConverted: ListItemModel = {
        id: menuItem.coreMenuId,
        label: menuItem.name,
        icon: menuItem.icon,
        items: convertMenuModel(menuItem.listChild),
        url: menuItem.urlPath,
        className: menuItem.className,
      };
      result.push(menuConverted);
    });
    return result;
  };

  const start = (
    <LinkTcd href={"/"}>
      <ImageTcd
        src={CommonHelper.getAbsolutePath("/images/static/logo.png?v=") ?? ""}
        width={140}
        height={55}
      ></ImageTcd>
    </LinkTcd>
  );
  const end = <HeaderRight></HeaderRight>;

  function convertMenuLiblaryModel(
    params?: ListItemModel[]
  ): MenuItem[] | undefined {
    const result: MenuItem[] = [];

    params?.forEach((x) => {
      const item: MenuItem = {
        id: x.id,
        icon: <IconTcd icon={x.icon} style={{ marginRight: "5px" }} />,
        url: x.url,
        className: x.className,
        style: x.style,
        label: x.label,
        command: (event) => {
          event.originalEvent.preventDefault();
          x.url && router.push(x.url);
        },
      };
      item.items = convertMenuLiblaryModel(x.items);
      result.push(item);
    });
    return result.length > 0 ? result : undefined;
  }

  const listMenuLiblary = useMemo<MenuItem[] | undefined>(() => {
    const listMenuTemp = CommonHelper.cloneList(listMenu);
    fun_refreshActive(listMenuTemp);
    const result = convertMenuLiblaryModel(listMenuTemp);
    return result;
  }, [listMenu, router.asPath]);

  return (
    <div>
      <Menubar model={listMenuLiblary} start={start} end={end} />
    </div>
  );
}
