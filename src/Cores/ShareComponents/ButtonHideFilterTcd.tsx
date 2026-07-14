import CommonConst from "../Constants/CommonConst";
import CommonHelper from "../Helpers/CommonHelper";
import ButtonTcd, { ButtonTcdModel } from "./ButtonTcd";

interface ButtonHideFilterTcdModel extends ButtonTcdModel {
  isOpen?: boolean;
}

export default function ButtonHideFilterTcd(
  props: Readonly<ButtonHideFilterTcdModel>
) {
  const { isOpen, icon, ...myProps } = props;
  const iconClass = props.isOpen
    ? CommonConst.classIcon.filterXmark
    : CommonConst.classIcon.filter;
  return (
    <ButtonTcd
      {...myProps}
      icon={iconClass}
      text="Bộ lọc"
      className={CommonHelper.concatClassNames(
        CommonConst.className.toolbarItem,
        props.className
      )}
    ></ButtonTcd>
  );
}
