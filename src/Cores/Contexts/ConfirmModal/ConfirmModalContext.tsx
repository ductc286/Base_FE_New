import { createContext, useContext } from "react";

export interface ConfirmModalContextStateModel {
  onOk?: (note?: string) => void;
  title?: React.ReactNode;
  message?: React.ReactNode;
  isShowNote?: boolean;
}

export interface ConfirmModalContextModel {
  setState?: (state: ConfirmModalContextStateModel) => void;
}

export const ConfirmModalContext = createContext<ConfirmModalContextModel>({});

export const useConfirmModalContext = () => useContext(ConfirmModalContext);
