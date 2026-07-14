import { Message } from "primereact/message";
import { ReactNode } from "react";

import { NotifyTypeEnum } from "@src/Cores/Enums/CommonEnum";

interface MesageTcdModel {
  text?: ReactNode;
  type?: NotifyTypeEnum;
}

export default function MesageTcd(props: MesageTcdModel) {
  const getType = () => {
    switch (props.type) {
      case NotifyTypeEnum.success:
        return "success";
      case NotifyTypeEnum.info:
        return "info";
      case NotifyTypeEnum.warning:
        return "warn";
      case NotifyTypeEnum.error:
        return "error";

      default:
        return undefined;
    }
  };

  return <Message text={props.text} severity={getType()} />;
}
