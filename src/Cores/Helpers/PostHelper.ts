const PostHelper = {
  getCodeByUrlId: function (id: string): string {
    if (!id) {
      return "";
    }
    const arr = id.split("-");
    if (arr.length === 0) {
      return "";
    }
    const code = arr[arr.length - 1];
    return code;
  },

  getUrlDetail: function (postData: any): string {
    return `/p/${postData.urlFriendly}-${postData.code}`;
  },
};

export default PostHelper;
