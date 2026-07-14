/* eslint-disable prettier/prettier */
/* eslint-disable @next/next/no-html-link-for-pages */
import { useRouter } from "next/router";
import { useMemo } from "react";

import { CommonConst } from "@src/Cores/Constants";
import { PageStatusEnum } from "@src/Cores/Enums/CommonEnum";
import { CommonHelper } from "@src/Cores/Helpers";

export interface PageStatusCpnModel {
  pageStatus: PageStatusEnum;
}
const PageStatusCpn = (props: PageStatusCpnModel) => {
  const router = useRouter();
  const urlLogin = useMemo(() => {
    const regexTempLogin = new RegExp(`^${CommonConst.url.login}`);
    const regexTemp = new RegExp(`^${CommonConst.url.page401}`);

    if (
      !regexTemp.test(router.pathname) &&
      !regexTempLogin.test(router.pathname) &&
      router.pathname !== CommonConst.url.home
    ) {
      return `/login?redirect=${CommonHelper.encodeURIComponent(router.asPath)}`;
    }
    return "/login";
  }, [props.pageStatus, router.asPath]);

  return (
    <div style={{ minHeight: "200px" }}>
      <div>
        {props.pageStatus === PageStatusEnum.loading && <span>Loading...</span>}
        {props.pageStatus === PageStatusEnum.noData && (
          <div className="p-4 text-center">
            Không có dữ liệu phù hợp để hiển thị
          </div>
        )}
      </div>

      {props.pageStatus === PageStatusEnum.page404 && (
        <div>
          <div>
            <h1 className="float-start display-3 me-4">404</h1>
            <h4 className="pt-3">Thất bại.</h4>
            <p className="text-medium-emphasis float-start">
              Trang bạn yêu cầu không tồn tại hoặc đã bị xóa bỏ.
            </p>
          </div>
          <div>
            Trở về{" "}
            <a href="/">
              <b>Trang chủ</b>
            </a>
          </div>
          <a href={urlLogin}>
            <b>Đăng nhập</b>
          </a>
        </div>
      )}
      {props.pageStatus === PageStatusEnum.page401 && (
        <div>
          <div>
            <h1 className="float-start display-3 me-4">401</h1>
            <h4 className="pt-3">Thất bại.</h4>
            <p className="text-medium-emphasis float-start">
              Bạn không có quyền truy cập tính năng này.
            </p>
          </div>
          Trở về{" "}
          <a href="/">
            <b>Trang chủ</b>
          </a>
          hoặc{" "}
          <a href={urlLogin}>
            <b>Đăng nhập</b>
          </a>
          {", xin cảm ơn!"}
        </div>
      )}
    </div>
  );
};

export default PageStatusCpn;
