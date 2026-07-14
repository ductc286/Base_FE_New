import { ReactNode, useEffect, useState } from "react";

import { CommonConst } from "@src/Cores/Constants";
import {
  ConfirmModalContext,
  ConfirmModalContextStateModel,
} from "@src/Cores/Contexts/ConfirmModal/ConfirmModalContext";
import { InputTypeEnum, SizeEnum } from "@src/Cores/Enums/CommonEnum";
import { CheckTypeHelper } from "@src/Cores/Helpers";
import { useCommonHelper } from "@src/Cores/Hooks";
import { InputChangeModel } from "@src/Cores/Models/CommonModels";
import {
  ButtonTcd,
  ColTcd,
  ContainerMiniTcd,
  FormGroupInputTcd,
  ModalTcd,
  RowTcd,
} from "@src/Cores/ShareComponents";

export default function ConfirmModalContextProvider({
  children,
}: {
  children?: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState<boolean | undefined>(false);
  const [myState, setMystate] = useState<ConfirmModalContextStateModel>({});

  function handleSetSate(state: ConfirmModalContextStateModel) {
    setIsOpen(true);
    setMystate(state);
  }

  return (
    <ConfirmModalContext.Provider
      value={{
        setState: handleSetSate,
      }}
    >
      {children}
      <ModalTcd
        isOpen={isOpen}
        onExit={() => setIsOpen(false)}
        size={SizeEnum.small}
      >
        <ModalContent
          {...myState}
          isOpen={isOpen}
          onOk={(note?: string) => {
            setIsOpen(false);
            setTimeout(() => {
              myState.onOk?.(note);
            }, 50);
          }}
          onClose={() => setIsOpen(false)}
        ></ModalContent>
      </ModalTcd>
    </ConfirmModalContext.Provider>
  );
}

interface ModalContentModel extends ConfirmModalContextStateModel {
  isOpen?: boolean;
  onClose?: () => void;
}
export function ModalContent(props: ModalContentModel) {
  const useCommonHelperState = useCommonHelper();
  const formId = useCommonHelperState.useGenerateFormId();

  const [note, setNote] = useState<string | undefined>();

  useEffect(() => {
    if (props.isOpen) {
      setTimeout(() => {
        document.getElementById(formId)?.focus();
      }, 100);
    }
  }, [props.isOpen]);

  return (
    <ContainerMiniTcd
      title={props.title ?? "Xác nhận!"}
      isShowIconClose={true}
      onClose={props.onClose}
    >
      <div className="min-h-16">
        {props.message && (
          <>
            {CheckTypeHelper.isString(props.message) ? (
              <div>{props.message}</div>
            ) : (
              props.message
            )}
          </>
        )}
        {props.isShowNote && (
          <RowTcd>
            <ColTcd>
              <FormGroupInputTcd
                label="Ghi chú"
                name="note"
                inputType={InputTypeEnum.text}
                value={note}
                onChange={(params: InputChangeModel) => {
                  setNote(params.value);
                }}
              />
            </ColTcd>
          </RowTcd>
        )}
      </div>

      <div className="w-full flex flex-row-reverse gap-2 mt-4">
        <ButtonTcd
          text="Đồng ý"
          icon={CommonConst.classIcon.save}
          color={CommonConst.classColor.success}
          onClick={() => {
            props.onOk?.(note);
          }}
          id={formId}
        ></ButtonTcd>
        <ButtonTcd
          text="Hủy bỏ"
          icon={CommonConst.classIcon.close}
          color={CommonConst.classColor.danger}
          onClick={props.onClose}
        ></ButtonTcd>
      </div>
    </ContainerMiniTcd>
  );
}
