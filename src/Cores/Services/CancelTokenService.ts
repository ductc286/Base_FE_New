//For cancel token when call api
export interface CancelTokenModel {
  instanceCancelToken: AbortController;
}

const CancelTokenService = {
  generateInstance: () => {
    const result: CancelTokenModel = {
      instanceCancelToken: new AbortController(),
    };
    return result;
  },

  abort: (cancelTokenModel?: CancelTokenModel) => {
    cancelTokenModel?.instanceCancelToken?.abort();
  },

  signal: (cancelTokenModel?: CancelTokenModel) => {
    return cancelTokenModel?.instanceCancelToken?.signal;
  },
};

export default CancelTokenService;
