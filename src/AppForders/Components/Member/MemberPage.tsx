// #region import
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import FamilyTreeFormCpn, {
  DataExtendModel,
} from "@src/AppForders/Components/FamilyTree/FamilyTreeFormCpn";
import MemberPageCpn from "@src/AppForders/Components/Member/MemberPageCpn";
import { FormModeEnum, PageModeEnum } from "@src/Cores/Enums/CommonEnum";
import { CommonHelper } from "@src/Cores/Helpers";
import { useCommonHelper } from "@src/Cores/Hooks";
import { FormPropsDataModel } from "@src/Cores/Models/CommonModels";
import { ContainerTcd, TabTcd } from "@src/Cores/ShareComponents";

// #endregion

export default function MenuPage() {
  // #region Constants
  const myPathName = "/member";
  const router = useRouter();
  const useCommonHelperState = useCommonHelper();
  // #endregion

  // #region states
  const isInitWhenRouterChange = useRef<boolean | undefined>(true);
  const [pathPageListLast, setPathPageListLast] = useState<string>(myPathName);
  const [tabActive, setTabActive] = useState(PageModeEnum.loading);
  const [formProps, setFormProps] = useState<
    FormPropsDataModel<DataExtendModel>
  >({
    formMode: FormModeEnum.unknown,
  });
  const [formListProps, setFormListProps] = useState<
    FormPropsDataModel<unknown>
  >({
    formMode: FormModeEnum.unknown,
  });
  const [isDataChange, setIsDataChange] = useState(false);
  const [isLoadedList, setIsLoadedList] = useState(false);
  // #endregion

  // #region useEffects
  useEffect(() => {
    if (!router.isReady) return;

    function handleInitList() {
      setFormListProps({
        formMode: FormModeEnum.list,
        stateId: CommonHelper.generateFormStateId(),
      });
      setIsDataChange(false);
      setIsLoadedList(true);
    }

    function handleInitForm() {
      setFormProps({
        formMode: useCommonHelperState.getFormMode(myPathName),
        stateId: CommonHelper.generateFormStateId(),
        recordId: router.query.id?.toString(),
      });
    }

    function promiseInit(tabActiveParam: PageModeEnum) {
      return new Promise((resolve) => {
        if (tabActiveParam === PageModeEnum.list) {
          handleInitList();
        } else if (tabActiveParam === PageModeEnum.form) {
          handleInitForm();
        }
        resolve("ok");
      });
    }

    // Xử lý pathname cũ
    const tabActiveTemp = useCommonHelperState.getPageMode(myPathName);
    if (tabActiveTemp === PageModeEnum.list) {
      setPathPageListLast(router.asPath);
    }
    if (tabActiveTemp !== tabActive) {
      setTabActive(tabActiveTemp);
    }

    if (isInitWhenRouterChange.current) {
      isInitWhenRouterChange.current = false;
      promiseInit(tabActiveTemp).finally(() => {
        isInitWhenRouterChange.current = true;
      });
    } else {
      isInitWhenRouterChange.current = true;
    }
  }, [router.asPath]);

  // #endregion

  // #region functions

  function handleChangeUrl(
    url: string,
    isReplace?: boolean,
    isInitWhenRouterChangeParam?: boolean
  ) {
    if (url !== router.asPath) {
      isInitWhenRouterChange.current = isInitWhenRouterChangeParam;
      if (isReplace) {
        router.replace(url);
      } else {
        router.push(url);
      }
    }
  }

  const handelOnExit = (isDataChangeParam?: boolean) => {
    handleChangeUrl(
      pathPageListLast,
      false,
      isDataChange || !isLoadedList || isDataChangeParam
    );
  };

  function handleOnFormModeChange(formChange: FormPropsDataModel<unknown>) {
    let urlNext = "";
    if (formChange.formMode === FormModeEnum.add) {
      urlNext = `${myPathName}/add`;
    } else if (formChange.formMode === FormModeEnum.edit) {
      urlNext = `${myPathName}/edit/${formChange.recordId}`;
    } else if (formChange.formMode === FormModeEnum.detail) {
      urlNext = `${myPathName}/detail/${formChange.recordId}`;
    }

    if (urlNext) {
      handleChangeUrl(urlNext);
    }
  }

  function handleGotoForm(formChange: FormPropsDataModel<unknown>) {
    let urlNext = "";
    if (formChange.formMode === FormModeEnum.add) {
      urlNext = `${myPathName}/add`;
    } else if (formChange.formMode === FormModeEnum.edit) {
      urlNext = `${myPathName}/edit/${formChange.recordId}`;
    } else if (formChange.formMode === FormModeEnum.detail) {
      urlNext = `${myPathName}/detail/${formChange.recordId}`;
    }

    if (urlNext) {
      handleChangeUrl(urlNext, false, true);
    }
  }
  // #endregion

  // #region main return
  return (
    <ContainerTcd>
      <TabTcd.TabContent activeTab={tabActive}>
        <TabTcd.TabPanel tabId={PageModeEnum.list} activeTab={tabActive}>
          <MemberPageCpn
            formProps={formListProps}
            onChangeUrl={(url) => handleChangeUrl(url, true)}
            onFormModeChange={handleGotoForm}
          />
        </TabTcd.TabPanel>
        <TabTcd.TabPanel tabId={PageModeEnum.form} activeTab={tabActive}>
          <FamilyTreeFormCpn
            formProps={formProps}
            onExit={handelOnExit}
            onDataChange={() => setIsDataChange(true)}
            onFormModeChange={handleOnFormModeChange}
          />
        </TabTcd.TabPanel>
      </TabTcd.TabContent>
    </ContainerTcd>
  );
  // #endregion
}
