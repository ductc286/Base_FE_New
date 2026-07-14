import { Dialog } from "primereact/dialog";

import { SizeEnum } from "@src/Cores/Enums/CommonEnum";
import ScrollTcd from "@src/Cores/ShareComponents/ScrollTcd";
import ScrollTopTcd from "@src/Cores/ShareComponents/ScrollTopTcd";

interface ModalTcdModel {
  children: any;
  isOpen?: boolean;
  // closable?: boolean;
  size?: SizeEnum;
  isCloseOnClickOutside?: boolean;
  isModal?: boolean; //là model hoặc popup treo

  onExit?: () => void;
}

export default function ModalTcd(props: Readonly<ModalTcdModel>) {
  function getClassName() {
    let result = "mapper-tcd";
    if (props.size === SizeEnum.small) {
      result += " w-[450px]";
    }
    if (props.size === SizeEnum.medium || props.size === undefined) {
      result += " w-[1140px]";
    }
    if (props.size === SizeEnum.large) {
      result += " w-[1320px]";
    }
    return result;
  }

  return (
    <Dialog
      showHeader={false}
      draggable={false}
      visible={props.isOpen}
      dismissableMask={props.isCloseOnClickOutside ?? true}
      className={getClassName()}
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
