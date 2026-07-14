// import "primereact/resources/themes/lara-light-blue/theme.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer } from "react-toastify";

import ControllerLayout from "@src/AppForders/Components/Layout/ControllerLayout";
import ContainerProvider from "@src/Cores/Contexts/Container/ContainerProvider";

// import "primeicons/primeicons.css";
import "@src/AppForders/Assets/Css/all-style.css";
import "@src/Cores/Assets/Css/all-core-style.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
library.add(fab, fas, far);

export default function MyApp({ Component, pageProps }: any) {
  return (
    <>
      <ContainerProvider>
        <ControllerLayout
          Component={Component}
          pageProps={pageProps}
        ></ControllerLayout>
        <ToastContainer />
      </ContainerProvider>
    </>
  );
}
