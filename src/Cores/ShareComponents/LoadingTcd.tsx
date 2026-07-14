import { Spin } from "antd";

interface ISpinTcd {
  isLoading?: boolean;
  children?: any;
}

export default function LoadingTcd(props: ISpinTcd) {
  return (
    <>
      <Spin spinning={props.isLoading === true} size="large" tip="Loading">
        {props.children}
      </Spin>
    </>
  );
}
