const CheckTypeHelper = {
  isString(input?: any) {
    return typeof input === "string";
  },
  isNumber(input?: any) {
    return typeof input === "number";
  },
};

export default CheckTypeHelper;
