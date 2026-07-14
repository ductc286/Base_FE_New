import { PrimeReactProvider } from "primereact/api";
import { ConfirmDialog } from "primereact/confirmdialog";

import ConfirmModalContextProvider from "@src/Cores/Contexts/ConfirmModal/ConfirmModalContextProvider";

export default function ContainerProvider({ children }: any) {
  return (
    <>
      {/* <AntdRegistry> */}
      <ConfirmModalContextProvider>
        <PrimeReactProvider>
          <ConfirmDialog />
          {children}
        </PrimeReactProvider>
      </ConfirmModalContextProvider>
      {/* </AntdRegistry> */}
    </>
  );
}
