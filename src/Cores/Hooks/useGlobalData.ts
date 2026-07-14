import { useCallback } from "react";

import { useGlobalContext } from "@src/AppForders/Components/Layout/MyGlobalProvider";
import { CommonHelper } from "@src/Cores/Helpers";
import { AuthorizeActionDefineModel } from "@src/Cores/Models/CommonModels";

export function useGlobalData() {
  const gloablData = useGlobalContext();

  const getAuthorizeAction = useCallback(
    (feature?: string) => {
      if (CommonHelper.isNullOrEmpty(feature)) {
        return {} as AuthorizeActionDefineModel;
      }
      const actions = (gloablData.authorizeActions || [])
        .filter(
          (x) => x.coreFeatureCode?.toLowerCase() === feature?.toLowerCase()
        )
        .map((action) => action.coreActionCode?.toLowerCase()?.trim())
        .filter((x) => x) as string[];

      return actions.reduce((result, action) => {
        (result as any)[action] = true;
        return result;
      }, {} as AuthorizeActionDefineModel);
    },
    [gloablData?.authorizeActions]
  );

  return { getAuthorizeAction };
}
