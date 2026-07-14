type ObjectModel = {
  [key: string]: any;
};

type DictionaryTModel<TEntity> = {
  [key: string]: TEntity | any;
};

type ObjectBooleanModel = {
  [key: string]: boolean | undefined;
};
