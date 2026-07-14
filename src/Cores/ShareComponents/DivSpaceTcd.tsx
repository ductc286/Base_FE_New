interface DivSpaceTcdModel {
  height: string;
}

export default function DivSpaceTcd(props: DivSpaceTcdModel) {
  return <div style={{ height: props.height, width: "100%" }}></div>;
}
