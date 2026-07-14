import CommonConst from "../Constants/CommonConst";
import IconTcd, { IconTcdModel } from "./IconTcd";

// export default function IconOnlyTcd(props: Readonly<IconTcdModel>) {
//   return (
//     <span style={{ fontSize: "1.15rem", color: CommonConst.color.black }}>
//       <IconTcd {...props}></IconTcd>
//     </span>
//   );
// }

const IconOnlyTcd = (props: IconTcdModel) => {
  const { onClick, className, ...propsCopy } = props;
  return (
    <span
      style={{ fontSize: "1.15rem", color: CommonConst.color.black }}
      className={className}
    >
      <IconTcd {...propsCopy}></IconTcd>
    </span>
  );
};
export default IconOnlyTcd;
