const SecurityHelper = {
  enCodePassWordLevelLow(input?: string) {
    if (!input) {
      return undefined;
    }
    return Buffer.from("ok".concat(input)).toString("base64");
  },

  deCodePassWordLevelLow(input?: string) {
    if (!input) {
      return undefined;
    }
    const result = Buffer.from(input, "base64").toString("ascii");
    return result.substring(2);
  },
};

export default SecurityHelper;
