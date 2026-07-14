//#region import
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import PageInternalFormCpn from "@src/Cores/Components/Admin/Post/PageInternal/PageInternalFormCpn";
import PageInternalListCpn from "@src/Cores/Components/Admin/Post/PageInternal/PageInternalListCpn";
import { FormModeEnum, PageModeEnum } from "@src/Cores/Enums/CommonEnum";
import { CommonHelper } from "@src/Cores/Helpers";
import { useCommonHelper } from "@src/Cores/Hooks";
import {
  FormPropsDataModel,
  PageContainerState,
} from "@src/Cores/Models/CommonModels";
import { ContainerTcd, TabTcd } from "@src/Cores/ShareComponents";

//#endregion

export default function PagePage() {
  //#region Constants
  const myPathName = "/admin/page";
  const router = useRouter();
  const useCommonHelperState = useCommonHelper();
  //#endregion

  //#region states
  const formState = useForm<PageContainerState>({
    defaultValues: {
      isInitWhenRouterChange: true,
      formProps: { formMode: FormModeEnum.unknown },
      listProps: { formMode: FormModeEnum.unknown },
      pathPageListLast: myPathName,
    },
  });
  //#endregion

  //#region useEffects
  //Khi url thay đổi không phải do bấm các action trong form, hoặc ban đầu vào page sẽ init dữ liệu
  useEffect(() => {
    if (!router.isReady) return;

    function handleInitList() {
      formState.setValue("listProps", {
        formMode: FormModeEnum.list,
        stateId: CommonHelper.generateFormStateId(),
      });
      formState.setValue("isInitList", true);
    }

    function handleInitForm() {
      formState.setValue("formProps", {
        formMode: useCommonHelperState.getFormMode(myPathName),
        stateId: CommonHelper.generateFormStateId(),
        recordId: router.query.id?.toString(),
      });
    }

    const tabActiveTemp = useCommonHelperState.getPageMode(myPathName);
    if (tabActiveTemp === PageModeEnum.list) {
      formState.setValue("pathPageListLast", router.asPath);
    }
    if (!formState.watch("isInitWhenRouterChange")) {
      formState.setValue("isInitWhenRouterChange", true);
      return;
    }
    if (tabActiveTemp === PageModeEnum.list) {
      handleInitList();
    } else if (tabActiveTemp === PageModeEnum.form) {
      handleInitForm();
    }
    if (tabActiveTemp !== formState.watch("tabActive")) {
      formState.setValue("tabActive", tabActiveTemp);
    }
    formState.setValue("isInitWhenRouterChange", true);
  }, [router.asPath]);

  //#endregion

  //#region functions

  function handleChangeUrl(url: string) {
    if (url && url !== router.asPath) {
      formState.setValue("isInitWhenRouterChange", false);
      router.push(url);
    }
  }

  const handelOnExit = (isDataChangeParam?: boolean) => {
    handleFormChange({
      formMode: FormModeEnum.list,
      stateId: isDataChangeParam
        ? CommonHelper.generateFormStateId()
        : undefined,
    });
  };

  const handleFormChange = (formChange: FormPropsDataModel<unknown>) => {
    let urlNext = "";
    if (formChange.formMode === FormModeEnum.add) {
      urlNext = `${myPathName}/add`;
    } else if (formChange.formMode === FormModeEnum.edit) {
      urlNext = `${myPathName}/edit/${formChange.recordId}`;
    } else if (formChange.formMode === FormModeEnum.detail) {
      urlNext = `${myPathName}/detail/${formChange.recordId}`;
    } else if (formChange.formMode === FormModeEnum.list) {
      urlNext = formState.watch("pathPageListLast");
    }

    if (urlNext) {
      handleChangeUrl(urlNext);
    }
    //setTimeout để đợi router.push done
    setTimeout(() => {
      if (formChange.formMode === FormModeEnum.list) {
        formState.setValue("listProps", {
          ...formChange,
          stateId:
            formState.watch("isDataChange") || !formState.watch("isInitList")
              ? CommonHelper.generateFormStateId()
              : formChange.stateId,
          pathPageListLast: urlNext,
        });
        formState.setValue("isInitList", true);
        formState.setValue("isDataChange", false);
      } else {
        formState.setValue("formProps", formChange);
      }
      formState.setValue(
        "tabActive",
        formChange.formMode === FormModeEnum.list
          ? PageModeEnum.list
          : PageModeEnum.form
      );
    }, 50);
  };
  //#endregion

  //#region main return
  const tabActive = formState.watch("tabActive") ?? PageModeEnum.list;
  return (
    <>
      <ContainerTcd>
        <TabTcd.TabPanel tabId={PageModeEnum.list} activeTab={tabActive}>
          <PageInternalListCpn
            formProps={formState.watch("listProps")}
            onChangeUrl={(url) => handleChangeUrl(url)}
            onFormModeChange={handleFormChange}
          ></PageInternalListCpn>
        </TabTcd.TabPanel>
        <TabTcd.TabPanel tabId={PageModeEnum.form} activeTab={tabActive}>
          <PageInternalFormCpn
            formProps={formState.watch("formProps")}
            onExit={handelOnExit}
            onDataChange={() => {
              formState.setValue("isDataChange", true);
            }}
            onFormModeChange={handleFormChange}
          ></PageInternalFormCpn>
        </TabTcd.TabPanel>
      </ContainerTcd>
    </>
  );
  //#endregion
}
