import { format, parse, toDate } from "date-fns";
import dayjs from "dayjs";

import CheckTypeHelper from "@src/Cores/Helpers/CheckTypeHelper";
import CommonHelper from "@src/Cores/Helpers/CommonHelper";

var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const _parseDateTime = (dateInput: any, dateFormats?: string[]) => {
  if (CommonHelper.isNullOrEmpty(dateInput)) {
    return undefined;
  } else if (dateFormats && !CommonHelper.isNullOrEmpty(dateFormats)) {
    let ret = undefined;
    for (let index = 0; index < dateFormats.length; index++) {
      const dateFormat = dateFormats[index];
      if (_isValidByFormat(dateInput, dateFormat)) {
        ret = parse(dateInput, dateFormat, new Date());
        break;
      }
    }
    return ret;
  }

  return dayjs(dateInput).toDate();
};

const DateTimeHelper = {
  format: function (dateInput: any, dateFormat?: string) {
    if (CommonHelper.isNullOrEmpty(dateInput)) {
      return undefined;
    } else {
      return format(dateInput, dateFormat ?? "dd/MM/yyyy HH:mm:ss");
    }
  },

  getDateTimeString: function (dateInput: any) {
    return this.format(dateInput, "dd/MM/yyyy HH:mm:ss");
  },

  getDateTimeShortString: function (dateInput: any) {
    return this.format(dateInput, "dd/MM/yyyy HH:mm");
  },

  getDateString: function (dateInput: any) {
    return this.format(dateInput, "dd/MM/yyyy");
  },

  parseDateTime: function (
    dateInput: any,
    isParseByFormat?: boolean,
    dateFormats?: string[]
  ) {
    // dateFormats ??= [
    //   "dd/MM/yyyy",
    //   "dd/MM/yyyy HH:mm:ss",
    //   "yyyy/MM/dd",
    //   "yyyy/MM/dd HH:mm:ss",
    // ];
    //todo: truyen time format từ form dùng
    return _parseDateTime(dateInput, isParseByFormat ? dateFormats : undefined);
  },

  compare: function (dateA: any, dateB: any) {
    if (
      CommonHelper.isNullOrEmpty(dateA) &&
      CommonHelper.isNullOrEmpty(dateB)
    ) {
      return 0;
    }
    if (CommonHelper.isNullOrEmpty(dateA)) {
      return -1;
    }
    if (CommonHelper.isNullOrEmpty(dateB)) {
      return 1;
    }
    return _parseDateTime(dateA)!.getTime() - _parseDateTime(dateB)!.getTime();
  },

  isValidInput: function (dateInput: any, dateFormats?: string[]) {
    if (CommonHelper.isNullOrEmpty(dateInput)) {
      return true;
    }
    if (
      CheckTypeHelper.isString(dateInput) &&
      dateFormats &&
      !CommonHelper.isNullOrEmpty(dateFormats)
    ) {
      let ret = false;
      for (let index = 0; index < dateFormats.length; index++) {
        const dateFormat = dateFormats[index];
        if (_isValidByFormat(dateInput, dateFormat)) {
          ret = true;
          break;
        }
      }
      return ret;
    }
    const dateParse = toDate(dateInput);
    return !Number.isNaN(dateParse.getDate());
  },

  getMinDateValid: function () {
    return _parseDateTime("01/01/1753", ["dd/MM/yyyy"]);
  },
};

export default DateTimeHelper;

function _isValidByFormat(dateInput: any, dateFormat: string) {
  const dateParse = parse(dateInput, dateFormat, new Date());
  return !Number.isNaN(dateParse.getDate());
}
