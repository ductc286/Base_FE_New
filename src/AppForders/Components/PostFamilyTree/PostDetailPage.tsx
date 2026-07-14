import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { CommonConst } from "@src/Cores/Constants";
import { HtmlHelper, PostHelper } from "@src/Cores/Helpers";
import { CorePostService } from "@src/Cores/Services";
import {
  ButtonTcd,
  ContainerTcd,
  ContentTcd,
} from "@src/Cores/ShareComponents";

export default function PPage() {
  //#region Constants
  const router = useRouter();
  //#endregion

  //#region states
  const [formData, setFormData] = useState<ObjectModel>({});
  //#endregion

  //#region useEffects
  useEffect(() => {
    if (router.isReady) {
      fun_initData();
    }
  }, [router.isReady, router.asPath]);
  //#endregion

  //#region functions
  function fun_initData() {
    const code = PostHelper.getCodeByUrlId(router.query.id as string);
    CorePostService.GetByCodeAndView(code).then((res: any) => {
      if (res.isSuccess) {
        setFormData(res.data);
      }
    });
  }
  //#endregion

  return (
    <>
      <ContainerTcd>
        <ContentTcd title={formData.name}>
          <div className="mt-4 mb-4" style={{ fontSize: "16px" }}>
            {HtmlHelper.parseHtml(formData.content)}
          </div>
          <ButtonTcd
            text="Quay lại"
            color={CommonConst.classColor.secondary}
            onClick={() => {
              router.back();
            }}
          ></ButtonTcd>
        </ContentTcd>
      </ContainerTcd>
    </>
  );
}
