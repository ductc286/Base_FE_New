import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";

export default function DevPopupHandleStateCpn({
  onClick,
}: {
  onClick: () => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Dialog
      position="bottom-right"
      showHeader={true}
      draggable={true}
      visible={isOpen}
      modal={false}
      onHide={() => {
        setIsOpen(false);
      }}
      header="Header"
    >
      <Button label="Dev Reload" icon="pi pi-check" onClick={onClick} />
    </Dialog>
  );
}
