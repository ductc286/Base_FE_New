import { DateTimeHelper } from "@src/Cores/Helpers";

import {
  AuthorizeInfoModel,
  TokenModel,
} from "../Services/Admin/AppAuthenticationService";

const AuthorizeHelper = {
  getTokenInfo() {
    const dataSource = localStorage.getItem("tokenInfo");
    if (!dataSource) {
      return undefined;
    }
    const tokenInfo = JSON.parse(dataSource);
    const ret = {
      ...tokenInfo,
      expireTime: DateTimeHelper.parseDateTime(tokenInfo.expireTime),
      expireTimeRefreshToken: DateTimeHelper.parseDateTime(
        tokenInfo.expireTimeRefreshToken
      ),
    };
    return ret as TokenModel;
  },

  getAuthorizeInfo() {
    const dataSource = localStorage.getItem("authorizeInfo");
    if (!dataSource) {
      return undefined;
    }
    const authorizeInfo = JSON.parse(dataSource);
    const ret = {
      ...authorizeInfo,
    };
    return ret as AuthorizeInfoModel;
  },

  setTokenInfo(dataParam?: TokenModel) {
    localStorage.setItem("tokenInfo", JSON.stringify(dataParam));
  },
};

export default AuthorizeHelper;
