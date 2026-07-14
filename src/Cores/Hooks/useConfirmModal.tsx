import { useConfirmModalContext } from "@src/Cores/Contexts/ConfirmModal/ConfirmModalContext";
import { ConfirmModel } from "@src/Cores/Helpers/ConfirmHelper";

export default function useConfirmModal() {
  const useConfirmModalContextState = useConfirmModalContext();

  function confirm(props: ConfirmModel) {
    useConfirmModalContextState.setState?.({
      title: props.title,
      isShowNote: props.isShowNote,
      message: props.message,
      onOk: props.onOk,
    });
  }

  return { confirm };
}
