import { JSX } from "react";

import { NotifyTypeEnum } from "@src/Cores/Enums/CommonEnum";
import ToastHelper from "@src/Cores/Helpers/ToastHelper";

export default function useToast() {
  function showToast(type: NotifyTypeEnum, message?: string | JSX.Element) {
    ToastHelper.toast(type, message);
  }

  return { showToast };
}
