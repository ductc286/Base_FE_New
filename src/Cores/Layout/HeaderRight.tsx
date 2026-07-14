import { Avatar } from "antd";
import { useRouter } from "next/router";

import AuthorizeHelper from "../Helpers/AuthorizeHelper";
import CommonHelper from "../Helpers/CommonHelper";
import { PopoverOptionTcd } from "../ShareComponents";

export default function HeaderRight() {
  const router = useRouter();
  const userInfo = AuthorizeHelper.getAuthorizeInfo()?.userInfo;

  return (
    <div>
      <div className="flex justify-content-center">
        <PopoverOptionTcd
          listItem={[
            {
              label: "Chế độ in",
              icon: "",
              onclick: () => {},
              render: (
                <div
                  className={
                    "p-menuitem-link w-full p-link flex align-items-center px-3 py-2"
                  }
                  style={{ cursor: "unset" }}
                >
                  <div
                    className="flex flex-column align"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <b className="font-bold">{userInfo?.fullName}</b>
                    <span className="text-sm">{userInfo?.userName}</span>
                  </div>
                </div>
              ),
            },
            {
              isSeparator: true,
            },
            {
              label: "Đổi mật khẩu",
              icon: "fas fa-key",
              onclick: () => {
                router.push("/admin/change-password");
              },
              url: "/admin/change-password",
            },
            {
              label: "Đăng xuất",
              icon: "fas fa-sign-out-alt",
              onclick: () => {
                router.push("/logout");
              },
              url: "/logout",
            },
          ]}
        >
          <Avatar
            size={"large"}
            src={CommonHelper.getAbsolutePath(
              "/images/static/avatar_default.png"
            )}
            style={{ cursor: "pointer" }}
          />
        </PopoverOptionTcd>
      </div>
    </div>
  );
}
