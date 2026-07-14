import { SelectDataModel } from "@src/Cores/Types/SelectDataModel";

const SelectDataService = {
  GetSexSelect: function (): SelectDataModel[] {
    return [
      {
        value: "male",
        label: "Nam",
      },
      {
        value: "female",
        label: "Nữ",
      },
    ];
  },
};

export default SelectDataService;
