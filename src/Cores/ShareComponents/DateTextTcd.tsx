import { Select } from "antd";
import { useMemo } from "react";

import CommonConst from "../Constants/CommonConst";
import CommonHelper from "../Helpers/CommonHelper";
import { SelectDateModel } from "../Types/SelectDateModel";
import ButtonTcd from "./ButtonTcd";

export interface IDateTextTcd {
  valueDay?: number;
  valueMonth?: number;
  valueYear?: number;

  onChangeDay: (value: number | undefined) => void;
  onChangeMonth: (value: number | undefined) => void;
  onChangeYear: (value: number | undefined) => void;

  onClear?: () => void;

  readOnly?: boolean;
}

export default function DateTextTcd(props: Readonly<IDateTextTcd>) {
  function getLabelOfSelect(input: number) {
    if (input < 10) {
      return "0" + String(input);
    }
    return String(input);
  }

  function getSelectDay(min: number, max: number) {
    const resutl: SelectDateModel[] = [];
    for (let index = min; index <= max; index++) {
      resutl.push({
        value: index,
        label: getLabelOfSelect(index),
      });
    }
    return resutl;
  }

  const selectDay = useMemo(() => getSelectDay(1, 31), []);
  const selectMonth = useMemo(() => getSelectDay(1, 12), []);
  const selectYear = useMemo(
    () => getSelectDay(1753, new Date().getFullYear() + 10),
    []
  );

  function filterOtion(input: string, option: SelectDateModel | undefined) {
    return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  }

  return (
    <div
      className={CommonHelper.concatClassNames(
        "inputgroup-tcd",
        props.readOnly && "form-input-readonly-tcd"
      )}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: "3px",
          border: "1px solid #d9d9d9",
        }}
      >
        <Select
          showSearch
          placeholder="dd"
          optionFilterProp="children"
          style={{ width: "35px" }}
          dropdownStyle={{ minWidth: "80px" }}
          onChange={(e) => {
            const newValue = e ? Number(e) : undefined;
            props.onChangeDay(newValue);
          }}
          value={props.valueDay}
          filterOption={filterOtion}
          // showArrow={false}
          menuItemSelectedIcon={undefined}
          suffixIcon={null}
          options={selectDay}
          className={CommonHelper.concatClassNames(
            "tcd-datetext-item2",
            props.readOnly && "form-input-readonly-tcd"
          )}
          // className="tcd-datetext-item2"
          disabled={props.readOnly}
          notFoundContent={<></>}
        />
        <div className="tcd-datetext-slash"> / </div>
        <Select
          showSearch
          placeholder="mm"
          optionFilterProp="children"
          style={{ width: "35px" }}
          dropdownStyle={{ minWidth: "80px" }}
          onChange={(e) => {
            const newValue = e ? Number(e) : undefined;
            props.onChangeMonth(newValue);
          }}
          value={props.valueMonth}
          filterOption={filterOtion}
          // showArrow={false}
          suffixIcon={null}
          options={selectMonth}
          className="tcd-datetext-item2"
          disabled={props.readOnly}
          notFoundContent={<></>}
        />
        <div className="tcd-datetext-slash"> / </div>
        <Select
          showSearch
          placeholder="yyyy"
          optionFilterProp="children"
          style={{ width: "50px" }}
          dropdownStyle={{ minWidth: "120px" }}
          onChange={(e) => {
            const newValue = e ? Number(e) : undefined;
            props.onChangeYear(newValue);
          }}
          value={props.valueYear}
          filterOption={filterOtion}
          // showArrow={false}
          suffixIcon={null}
          options={selectYear}
          className="tcd-datetext-item2"
          disabled={props.readOnly}
          notFoundContent={<></>}
        />
      </div>
      <ButtonTcd
        icon={CommonConst.classIcon.close}
        onClick={props.onClear}
        disabled={props.readOnly}
        className="input-icon-tcd"
      />
    </div>
  );
}
