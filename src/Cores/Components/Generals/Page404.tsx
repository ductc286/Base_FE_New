import PageStatus from "@src/Cores/Components/PageStatus/PageStatus";
import { PageStatusEnum } from "@src/Cores/Enums/CommonEnum";

const Page404 = () => {
  return <PageStatus pageStatus={PageStatusEnum.page404}></PageStatus>;
};

export default Page404;
