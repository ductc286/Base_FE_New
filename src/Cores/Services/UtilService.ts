import ApiHelper from "@src/Cores/Helpers/Api/ApiHelper";

const UtilService = {
  NormalizeUrlFriendly: async function (name?: string) {
    return (
      await ApiHelper.get<string | undefined>(
        "/api/Util/NormalizeUrlFriendly/",
        { name: name }
      )
    ).data;
  },
};

export default UtilService;
