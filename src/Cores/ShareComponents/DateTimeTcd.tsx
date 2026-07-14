import { addLocale } from "primereact/api";
import { Calendar } from "primereact/calendar";
import { InputMask } from "primereact/inputmask";
import { FormEvent } from "primereact/ts-helpers";
import { CSSProperties, SyntheticEvent, useEffect, useState } from "react";

import { CommonConst } from "@src/Cores/Constants";
import { CommonHelper } from "@src/Cores/Helpers";
import DateTimeHelper from "@src/Cores/Helpers/DateTimeHelper";
import { InputChangeModel } from "@src/Cores/Models/CommonModels";
import ButtonTcd from "@src/Cores/ShareComponents/ButtonTcd";
import PopoverTcd from "@src/Cores/ShareComponents/Popover/PopoverTcd";

const getValue = (dateInput: any) => {
  return DateTimeHelper.getDateString(dateInput);
};

export interface DateTimeTcdModel {
  value?: string;
  id?: string;
  name?: string;
  className?: string;
  style?: CSSProperties;
  error?: string;
  readOnly?: boolean;
  disabled?: boolean;
  placeholder?: string;

  onChange?: (params: InputChangeModel) => void;
}

export default function DateTimeTcd(props: DateTimeTcdModel) {
  const currentDate = DateTimeHelper.parseDateTime(props.value);
  const [dateText, set_dateText] = useState<string | undefined>(
    getValue(props.value)
  );
  const [isOpen, set_isOpen] = useState<boolean>(false);

  useEffect(() => {
    const newDate = getValue(props.value);
    set_dateText(newDate);
  }, [props.value]);

  const fun_onChange = (value: any) => {
    if (DateTimeHelper.compare(value, props.value) !== 0) {
      props.onChange?.({ value: value, event: value });
    }
  };

  const onCalendarChange = (
    e: FormEvent<Date, SyntheticEvent<Element, Event>>
  ) => {
    if (DateTimeHelper.compare(e.value, props.value) !== 0) {
      props.onChange?.({ value: e.value, event: e });
    }
  };
  const formatDate = "dd/MM/yyyy";

  useEffect(() => {
    addLocale("vi", {
      firstDayOfWeek: 1,
      dayNames: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
      dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
      dayNamesMin: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
      monthNames: [
        "Tháng một",
        "Tháng hai",
        "Tháng ba",
        "Tháng tư",
        "Tháng năm",
        "Tháng sáu",
        "Tháng bảy",
        "Tháng tám",
        "Tháng chín",
        "Tháng mười",
        "Tháng mười một",
        "Tháng mười hai",
      ],
      monthNamesShort: [
        "Một",
        "Hai",
        "Ba",
        "Bốn",
        "Năm",
        "Sáu",
        "Bảy",
        "Tám",
        "Chín",
        "Mười",
        "Mười một",
        "Mười hai",
      ],
      today: "Hôm nay",
      clear: "Xóa bỏ",
    });
  }, []);
  return (
    <PopoverTcd
      content={
        <Calendar
          value={currentDate}
          onChange={(e) => {
            onCalendarChange(e);
            set_isOpen(false);
          }}
          inline
          locale="vi"
        />
      }
      isOpen={isOpen}
      onOpenChange={(isOpenParam) => {
        if (!isOpenParam) {
          set_isOpen(false);
        }
      }}
    >
      <div className="inputgroup-tcd p-inputgroup">
        <InputMask
          value={dateText}
          mask="99/99/9999"
          className={CommonHelper.concatClassNames(
            "w-full mapper-tcd",
            props.readOnly ? "form-input-readonly-tcd" : undefined,
            props.error && CommonConst.className.inputInvalid
          )}
          id={props.id}
          placeholder={formatDate}
          slotChar={formatDate}
          readOnly={props.readOnly}
          onChange={(e) => {
            if (e.target?.value === dateText) {
              return;
            }
            set_dateText(e.target?.value ?? "");
            if (e.target.value === "") {
              fun_onChange(undefined);
            } else if (
              DateTimeHelper.isValidInput(e.target.value, [formatDate])
            ) {
              const dateChange = DateTimeHelper.parseDateTime(
                e.target.value,
                true,
                [formatDate]
              );
              fun_onChange(dateChange);
            }
          }}
          onBlur={(e) => {
            if (!DateTimeHelper.isValidInput(e.target.value, [formatDate])) {
              set_dateText(getValue(props.value));
            }
          }}
          onClick={(e) => {}}
        ></InputMask>
        <ButtonTcd
          icon={CommonConst.classIcon.calendar}
          className="input-icon-tcd"
          disabled={props.readOnly || props.disabled}
          onClick={() => {
            set_isOpen(!isOpen);
          }}
        ></ButtonTcd>
      </div>
    </PopoverTcd>
  );
}
