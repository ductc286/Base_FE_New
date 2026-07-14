import ButtonTcd from "./ButtonTcd";
import ToolbarTcd from "./ToolbarTcd";

interface ToolbarTableTcdModel {
  children: any;
  className?: string;
}

export default function ToolbarTableTcd(props: ToolbarTableTcdModel) {
  return (
    <ToolbarTcd.Container>
      <ToolbarTcd.Left></ToolbarTcd.Left>
      <ToolbarTcd.Right>
        <ButtonTcd text="setting"></ButtonTcd>
      </ToolbarTcd.Right>
    </ToolbarTcd.Container>
  );
}
