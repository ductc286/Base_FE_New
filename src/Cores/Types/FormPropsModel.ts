type FormDataPropsModel = {
  formMode?: string;
  actionCode?: number;
  recordId?: any;
  formData?: ObjectModel;
  formDataHelper?: ObjectModel;
};

type FormComponentPropsModel = {
  formProps: FormDataPropsModel;
  onExit?: (isDataChange?: boolean) => void;
  onFormModeChange?: (formMode: string, recordId: any) => void;
  onDataChange?: () => void;
};
