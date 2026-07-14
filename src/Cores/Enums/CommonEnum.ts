export enum FormModeEnum {
  unknown,
  list,
  add,
  edit,
  detail,
  other,
  notFound,
}

export enum PageModeEnum {
  loading,
  list,
  form, //add/edit/detail
  notFound,
}

export enum SizeEnum {
  small,
  medium,
  large,
}

export enum DataTypeEnum {
  undefined,
  string,
  number,
  date,
  datetime,
  boolean,
  array,
  arrayString,
}

export enum SearchTypeEnum {
  contains,
  notContains,
  equal,
  inList,
  notInList,
}

export enum InputTypeEnum {
  text,
  number,
  dateTime,
  select,
  password,
  checkbox,
  textarea,
}

export enum FormInputLayoutTypeEnum {
  horizontal,
  vertical,
}

export enum NotifyTypeEnum {
  success,
  warning,
  error,
  info,
}

export enum PropertyRuleTypeEnum {
  requied,
  minLength,
  maxLength,
  minValue,
  maxValue,

  dateValid,
  yearOfDateValid,
  password,
  code,
  name,
}

export enum PlacementEnum {
  top,
  topStart,
  topEnd,
  right,
  rightStart,
  rightEnd,
  bottom,
  bottomStart,
  bottomEnd,
  left,
  leftStart,
  leftRight,
}

export enum PageStatusEnum {
  ok = "ok",
  loading = "loading",
  page404 = "404",
  page401 = "401",
  noData = "notData",
}
