import { CSSProperties, ReactNode } from "react";

import ToolbarTcd from "../ToolbarTcd";

interface TableToolbarTcd<TEntity> {
  style?: CSSProperties;
  className?: string;
  totalRecordsQuery?: number;
  totalRecordsSelected?: number;
  isStyleInCard?: boolean;

  rightComponent?: ReactNode;
}

export default function TableToolbarTcd<TEntity>(
  props: Readonly<TableToolbarTcd<TEntity>>
) {
  return (
    <ToolbarTcd.Container isStyleInCard={props.isStyleInCard}>
      <ToolbarTcd.Left>Đã chọn: {props.totalRecordsSelected}</ToolbarTcd.Left>
      <ToolbarTcd.Right>{props.rightComponent}</ToolbarTcd.Right>
    </ToolbarTcd.Container>
  );
}
