import { JSX } from "react";

export type SelectDataModel = {
  value?: string | number;
  label?: string | JSX.Element;
  labelSelected?: string | JSX.Element;
  placeholderInputSearch?: string; //placeholder cho input filter, chỉ phục vụ cho input filter common
  extendValue?: any; //Giá trị Trường mở rộng
  extendName?: string; //Tên hiển thị của Trường mở rộng
  modelValue?: any; //Giá trị của cả model select
};
