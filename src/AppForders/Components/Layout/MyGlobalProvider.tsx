import { createContext, useContext } from "react";
import { useForm } from "react-hook-form";

import { AuthorizeHelper } from "@src/Cores/Helpers";
import { AuthorizeActionModel } from "@src/Cores/Models/CommonModels";
import { AuthorizeUser } from "@src/Cores/Services/Admin/AppAuthenticationService";

export interface ControllerLayoutModel {
  //   authorizeInfoModel?: AuthorizeInfoModel;
  listUrlAllow?: string[];
  userInfo?: AuthorizeUser;
  authorizeActions?: AuthorizeActionModel[];
}

export const MyGlobalContext = createContext<ControllerLayoutModel>({});

export const useGlobalContext = () => useContext(MyGlobalContext);

function MyGlobalProvider({ children }: { children: React.ReactNode }) {
  //const user = useContext(ControllerLayoutModel);
  const form = useForm({
    defaultValues: {
      authorizeInfoModel: AuthorizeHelper.getAuthorizeInfo(),
    },
  });

  return (
    <>
      <MyGlobalContext.Provider
        value={{
          listUrlAllow: form.watch("authorizeInfoModel")?.listUrl,
          userInfo: form.watch("authorizeInfoModel")?.userInfo,
          authorizeActions: form.watch("authorizeInfoModel")?.authorizeActions,
        }}
      >
        {children}
      </MyGlobalContext.Provider>
    </>
  );
}

export default MyGlobalProvider;
