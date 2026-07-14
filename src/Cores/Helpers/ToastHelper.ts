import { JSX } from "react";
import { toast } from "react-toastify";

import { NotifyTypeEnum } from "../Enums/CommonEnum";

const CLOSE_TIME_DEFAULT = 2000; //  seconds
const ToastHelper = {
  toast: function (type: NotifyTypeEnum, message?: string | JSX.Element) {
    switch (type) {
      case NotifyTypeEnum.success:
        toast.success(message, {
          theme: "colored",
          autoClose: CLOSE_TIME_DEFAULT,
        });
        break;
      case NotifyTypeEnum.warning:
        toast.warning(message, {
          theme: "colored",
          autoClose: CLOSE_TIME_DEFAULT,
        });
        break;
      case NotifyTypeEnum.error:
        toast.error(message, {
          theme: "colored",
          autoClose: CLOSE_TIME_DEFAULT,
        });
        break;
      case NotifyTypeEnum.info:
        toast.info(message, {
          theme: "colored",
          autoClose: CLOSE_TIME_DEFAULT,
        });
        break;
      default:
        break;
    }
  },
};

export default ToastHelper;
