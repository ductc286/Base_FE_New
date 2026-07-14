import { Dialog } from "primereact/dialog";
import { useMemo } from "react";

import { SizeEnum } from "@src/Cores/Enums/CommonEnum";
import ScrollTcd from "@src/Cores/ShareComponents/ScrollTcd";
import ScrollTopTcd from "@src/Cores/ShareComponents/ScrollTopTcd";

interface ModalTcdModel {
  children: any;
  isOpen?: boolean;
  // closable?: boolean;
  size?: SizeEnum;
  isCloseOnClickOutside?: boolean;

  onExit?: () => void;
}

export default function ModalTcd(props: Readonly<ModalTcdModel>) {
  const className = useMemo(() => {
    let result = "mapper-tcd w-11";
    if (props.size === SizeEnum.small) {
      result += " md:w-6 lg:w-4 xl:w-3";
    }
    if (props.size === SizeEnum.medium || props.size === undefined) {
      result += " xl:w-8";
    }
    if (props.size === SizeEnum.large) {
      result += " md:w-11 lg:w-10 xl:w-9";
    }
    return result;
  }, [props.size]);

  return (
    <Dialog
      showHeader={false}
      draggable={false}
      visible={props.isOpen}
      // style={{ width: "50vw" }}
      dismissableMask={props.isCloseOnClickOutside !== false}
      className={className}
      contentClassName="mapper-tcd"
      maskClassName="mapper-tcd"
      onHide={() => {
        props.onExit?.();
      }}
    >
      <ScrollTcd>
        {props.children}
        <ScrollTopTcd />
      </ScrollTcd>
    </Dialog>
  );

  // return (
  //   <Modal
  //     centered
  //     footer={null}
  //     open={props.isOpen}
  //     closable={false}
  //     onCancel={props.onExit}
  //     width={width}
  //   >
  //     <ScrollTcd>
  //       {props.children}
  //       <ScrollTopTcd />
  //     </ScrollTcd>
  //   </Modal>
  // );
}
