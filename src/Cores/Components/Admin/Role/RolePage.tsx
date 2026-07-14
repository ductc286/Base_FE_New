//#region import
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import RoleFormCpn from "@src/Cores/Components/Admin/Role/RoleFormCpn";
import RolePageCpn from "@src/Cores/Components/Admin/Role/RolePageCpn";
import { FormModeEnum, PageModeEnum } from "@src/Cores/Enums/CommonEnum";
import { CommonHelper } from "@src/Cores/Helpers";
import { useCommonHelper } from "@src/Cores/Hooks";
import {
  FormPropsDataModel,
  PageContainerState,
} from "@src/Cores/Models/CommonModels";
import { ContainerTcd, TabTcd } from "@src/Cores/ShareComponents";

//#endregion

export default function PostCategoryPage() {
  //#region Constants
  const myPathName = "/admin/role";
  const router = useRouter();
  const useCommonHelperState = useCommonHelper();
  //#endregion

  //#region states
  const form = useForm<PageContainerState>({
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
      form.setValue("listProps", {
        formMode: FormModeEnum.list,
        stateId: CommonHelper.generateFormStateId(),
      });
      form.setValue("isInitList", true);
    }

    function handleInitForm() {
      form.setValue("formProps", {
        formMode: useCommonHelperState.getFormMode(myPathName),
        stateId: CommonHelper.generateFormStateId(),
        recordId: router.query.id?.toString(),
      });
    }

    const tabActiveTemp = useCommonHelperState.getPageMode(myPathName);
    if (tabActiveTemp === PageModeEnum.list) {
      form.setValue("pathPageListLast", router.asPath);
    }
    if (!form.watch("isInitWhenRouterChange")) {
      form.setValue("isInitWhenRouterChange", true);
      return;
    }
    if (tabActiveTemp === PageModeEnum.list) {
      handleInitList();
    } else if (tabActiveTemp === PageModeEnum.form) {
      handleInitForm();
    }
    if (tabActiveTemp !== form.watch("tabActive")) {
      form.setValue("tabActive", tabActiveTemp);
    }
    form.setValue("isInitWhenRouterChange", true);
  }, [router.asPath]);

  //#endregion

  //#region functions

  function handleChangeUrl(url: string) {
    if (url && url !== router.asPath) {
      form.setValue("isInitWhenRouterChange", false);
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
      urlNext = form.watch("pathPageListLast");
    }

    if (urlNext) {
      handleChangeUrl(urlNext);
    }
    //setTimeout để đợi router.push done
    setTimeout(() => {
      if (formChange.formMode === FormModeEnum.list) {
        form.setValue("listProps", {
          ...formChange,
          stateId:
            form.watch("isDataChange") || !form.watch("isInitList")
              ? CommonHelper.generateFormStateId()
              : formChange.stateId,
          pathPageListLast: urlNext,
        });
        form.setValue("isInitList", true);
        form.setValue("isDataChange", false);
      } else {
        form.setValue("formProps", formChange);
      }
      form.setValue(
        "tabActive",
        formChange.formMode === FormModeEnum.list
          ? PageModeEnum.list
          : PageModeEnum.form
      );
    }, 50);
  };
  //#endregion

  //#region main return
  const tabActive = form.watch("tabActive") ?? PageModeEnum.list;
  return (
    <>
      <ContainerTcd>
        <TabTcd.TabPanel tabId={PageModeEnum.list} activeTab={tabActive}>
          <RolePageCpn
            formProps={form.watch("listProps")}
            onChangeUrl={(url) => handleChangeUrl(url)}
            onFormModeChange={handleFormChange}
          ></RolePageCpn>
        </TabTcd.TabPanel>
        <TabTcd.TabPanel tabId={PageModeEnum.form} activeTab={tabActive}>
          <RoleFormCpn
            formProps={form.watch("formProps")}
            onExit={handelOnExit}
            onDataChange={() => {
              form.setValue("isDataChange", true);
            }}
            onFormModeChange={handleFormChange}
          ></RoleFormCpn>
        </TabTcd.TabPanel>
      </ContainerTcd>
    </>
  );
  //#endregion
}
