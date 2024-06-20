import { MetamaskIcon } from "../../ui/icons";
import Modal, { ModalAction } from "../../ui/modal";
import {
  useModalsStore,
  useModalsDispatch,
  ModalsActionsEnum,
} from "../../../context/modal";

export const MetamaskInfo = () => {
  const {
    metamaskInfo: { open, title, text, message, content, actionButtonColor },
  } = useModalsStore();
  const dispatchModals = useModalsDispatch();

  const closeModal = () => {
    dispatchModals({
      type: ModalsActionsEnum.SHOW_METAMASK_INFO,
      payload: {
        open: false,
        title,
        text,
        content,
      },
    });
  };

  const modalActions: ModalAction[] = [
    {
      name: "Close",
      onClick: closeModal,
      color: actionButtonColor || "primary",
    },
  ];

  return (
    <Modal
      title={title}
      titleIcon={<MetamaskIcon className="text-default-500" />}
      isOpen={open}
      closeModal={closeModal}
      modalActions={actionButtonColor ? modalActions : undefined}
    >
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">{text}</h1>
        <div className="flex flex-col items-center">
          {message && <p className="space-y-2">{text}</p>}
          {content}
        </div>
      </div>
    </Modal>
  );
};
