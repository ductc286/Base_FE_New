import PageStatusCpn, {
  PageStatusCpnModel,
} from "@src/Cores/Components/PageStatus/PageStatusCpn";
import { SizeEnum } from "@src/Cores/Enums/CommonEnum";
import { ContainerTcd } from "@src/Cores/ShareComponents";

const PageStatus = (props: PageStatusCpnModel) => {
  return (
    <ContainerTcd
      size={SizeEnum.large}
      className="h-screen flex items-center justify-center"
    >
      <PageStatusCpn {...props}></PageStatusCpn>
    </ContainerTcd>
  );
};

export default PageStatus;
