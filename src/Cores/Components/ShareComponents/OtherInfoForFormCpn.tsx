//#region imports

import { CommonConst } from "@src/Cores/Constants";
import { InputTypeEnum } from "@src/Cores/Enums/CommonEnum";
import { DateTimeHelper } from "@src/Cores/Helpers";
import {
  CardTcd,
  ColTcd,
  FormGroupInputTcd,
  RowTcd,
} from "@src/Cores/ShareComponents";

//#endregion

export interface OtherInfoForFormCpnModel {
  isOpen?: boolean;
  isCanCollapse?: boolean;
  formData?: any;

  onChangeOpen?: (isOpen?: boolean) => void;
}
export default function OtherInfoForFormCpn(props: OtherInfoForFormCpnModel) {
  return (
    <>
      <CardTcd
        title="Thông tin khác"
        onChangeOpen={props.onChangeOpen}
        isCanCollapse={props.isCanCollapse}
        isOpen={props.isOpen}
      >
        <RowTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Người thêm"
              name="userInsert"
              readOnly={true}
              inputType={InputTypeEnum.text}
              value={props.formData?.userInsert}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="TG thêm"
              name="userInsert"
              readOnly={true}
              inputType={InputTypeEnum.text}
              value={DateTimeHelper.getDateTimeString(
                props.formData?.insertTime
              )}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="Người cập nhật"
              name="userUpdate"
              readOnly={true}
              inputType={InputTypeEnum.text}
              value={props.formData?.userUpdate}
            />
          </ColTcd>
          <ColTcd config={CommonConst.configColDefault}>
            <FormGroupInputTcd
              label="TG cập nhật"
              name="userUpdate"
              readOnly={true}
              inputType={InputTypeEnum.text}
              value={DateTimeHelper.getDateTimeString(
                props.formData?.updateTime
              )}
            />
          </ColTcd>
        </RowTcd>
      </CardTcd>
    </>
  );
  //#endregion
}
