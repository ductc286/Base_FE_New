type ListPropsDataModel = {
  actionCode?: number;
  listIdIgnore?: Array<ObjectModel>;
};

type ListPropsModel = {
  propsData: ListPropsDataModel;
  onExit: (isDataChange?: boolean) => void;
  onSave: (listData: Array<ObjectModel>) => void;
};
