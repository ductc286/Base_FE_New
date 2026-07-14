import { confirmDialog } from "primereact/confirmdialog";

export interface ConfirmModel {
  title?: string;
  // message?: string | JSX.Element;
  message?: React.ReactNode;
  isShowNote?: boolean;

  onOk?: (note?: string) => void;
}

const ConfirmHelper = {
  confirm: function (props: ConfirmModel) {
    confirmDialog({
      message: props.message,
      header: props.title ?? "Xác nhận",
      icon: "pi pi-exclamation-triangle",
      draggable: false,
      accept: props.onOk,
      acceptLabel: "Đồng ý",
      rejectLabel: "Hủy bỏ",
      dismissableMask: true,
      acceptIcon: "pi pi-check",
    });
  },
};

export default ConfirmHelper;
