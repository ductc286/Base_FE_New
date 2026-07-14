import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import PageStatus from "@src/Cores/Components/PageStatus/PageStatus";
import { CommonConst } from "@src/Cores/Constants";
import { PageStatusEnum } from "@src/Cores/Enums/CommonEnum";
import { AuthorizeHelper, CommonHelper } from "@src/Cores/Helpers";
import { AppAuthenticationService } from "@src/Cores/Services";

//#region models
const routes = [
  "^/admin/user/add/",
  "^/admin/user/detail/",
  "^/admin/user/edit/",
  "^/admin/user/?$",

  "^/admin/role/add/",
  "^/admin/role/detail/",
  "^/admin/role/edit/",
  "^/admin/role/?$",

  "^/admin/menu/add/",
  "^/admin/menu/detail/",
  "^/admin/menu/edit/",
  "^/admin/menu/?$",

  "^/admin/group/add/",
  "^/admin/group/detail/",
  "^/admin/group/edit/",
  "^/admin/group/?$",

  "^/admin/authorization/function/?$",
  "^/admin/authorization/menu/?$",
  "^/admin/authorization/user/?$",

  "^/admin/dashboard/?$",

  "^/admin/post/",
  "^/admin/post/detail/",
  "^/admin/post/edit/",
  "^/admin/post/add/",

  "^/admin/post-internal/",
  "^/admin/post-internal/detail/",
  "^/admin/post-internal/edit/",
  "^/admin/post-internal/add/",

  "^/admin/page/",
  "^/admin/page/detail/",
  "^/admin/page/edit/",
  "^/admin/page/add/",

  "^/admin/page-internal/",
  "^/admin/page-internal/detail/",
  "^/admin/page-internal/edit/",
  "^/admin/page-internal/add/",

  "^/admin/post-category/",
  "^/admin/post-category/detail/",
  "^/admin/post-category/edit/",
  "^/admin/post-category/add/",

  "^/admin/post-category-internal/",
  "^/admin/post-category-internal/detail/",
  "^/admin/post-category-internal/edit/",
  "^/admin/post-category-internal/add/",

  "^/c/",
  "^/p/",

  "^/admin/family-tree/",

  "^/?$",
  "^/other/",
  //For test
  "^/admin/change-password/?$",
  "/test",
  "^/member",

  // '\w',
];
const routesAllowAnonymous = [
  "/login/",
  "/logout/",
  "/other/401/",
  "/other/404/",
  "/admin/change-password/",
  // "/member",
  "/admin/authorization/role",
  // '/',
];
//Những route chỉ cần login, không cần phân quyền
const routesOnlyLogined: string[] = [
  // '/admin/c/',
  // '/admin/p/',
];

export interface AuthenticationCpnModel {
  onCheckAuthorizeDone: () => void;
}
//#endregion

const AuthenticationCpn = (props: AuthenticationCpnModel) => {
  const router = useRouter();
  const [status, setStatus] = useState(PageStatusEnum.loading);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const handleAuthorized = (statusAuthorize: PageStatusEnum) => {
      if (statusAuthorize === CommonConst.pageStatus.ok) {
        props.onCheckAuthorizeDone();
      } else {
        setStatus(statusAuthorize);
      }
    };

    const redirectLogin = () => {
      if (router.pathname.includes("/login")) {
        return;
      }
      router.push({
        pathname: CommonConst.url.login,
        query:
          router.asPath != "/"
            ? { redirect: encodeURIComponent(router.asPath) }
            : undefined,
      });
    };
    const isValidUrl = (regex: any, urlInput?: string) => {
      if (!urlInput) {
        return false;
      }
      if (urlInput && !urlInput.match("/$")) {
        urlInput = urlInput + "/";
      }
      return urlInput.match(regex);
    };

    const pathname = router.pathname.match("/$")
      ? router.pathname
      : router.pathname + "/";
    const currentUrlRegex = routes.find((s) => pathname.match(s));
    //Nếu url không tìm thấy thì chuyển trang 404
    if (CommonHelper.isNull(currentUrlRegex)) {
      handleAuthorized(PageStatusEnum.page404);
      return;
    }

    let listUrl = [...routesAllowAnonymous]; //Thêm ds page không cần phân quyền cũng sẽ được vào
    //Nếu có quyền thì ok return
    if (listUrl.some((s) => isValidUrl(currentUrlRegex, s))) {
      handleAuthorized(PageStatusEnum.ok);
      return;
    }

    //Gọi api để lấy ds quyền được phép
    AppAuthenticationService.RefreshTokenIfAccessTokenExpired()
      .then(() => {
        AppAuthenticationService.GetAuthorizeInfo()
          .then((res) => {
            if (res.isSuccess) {
              const authorizeInfo = res.data;
              if (authorizeInfo?.listUrl) {
                listUrl = routesAllowAnonymous.concat(authorizeInfo?.listUrl);
              }
              let tokenInfo = AuthorizeHelper.getTokenInfo();

              //Nếu có token và token hết hạn thì chuyển tới trang login
              if (tokenInfo?.expireTime && tokenInfo?.expireTime < new Date()) {
                redirectLogin();
                return;
              }
              //Nếu là những page chỉ cần đăng nhập thì ok return
              if (
                !CommonHelper.isNull(tokenInfo) &&
                routesOnlyLogined.some((s) => isValidUrl(currentUrlRegex, s))
              ) {
                handleAuthorized(PageStatusEnum.ok);
                return;
              }
              //Nếu có quyền thì ok return
              if (listUrl.some((s) => isValidUrl(currentUrlRegex, s))) {
                handleAuthorized(PageStatusEnum.ok);
                return;
              }
              //Nếu không có quyền và chưa đăng nhập thì chuyển tới trang login
              if (
                CommonHelper.isNull(tokenInfo?.accessToken) ||
                /^\/$/.test(router.pathname)
              ) {
                redirectLogin();
              }
              //Nếu không có quyền và đã đăng nhập thì chuyển tới trang 401
              else {
                handleAuthorized(PageStatusEnum.page401);
              }
            }
          })
          .catch();
      })
      .catch();
  }, [router.isReady]);
  return <PageStatus pageStatus={status} />;
};

export default AuthenticationCpn;
