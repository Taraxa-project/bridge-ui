"use client";

import React, { useEffect } from "react";
import clsx from "clsx";

export interface ModalAction {
  name: string;
  disabled?: boolean;
  type?: "button" | "reset" | "submit";
  onClick: (value?: any) => void;
  color: "primary" | "secondary" | "warning" | "error" | "neutral" | "base";
  size?: "xs" | "sm" | "lg";
}

export interface ModalProps {
  titleIcon?: React.ReactNode;
  title: string;
  isOpen: boolean;
  closeModal: () => void;
  children?: React.ReactNode;
  modalActions?: ModalAction[];
  showCancel?: boolean;
  cancelButtonText?: string;
  height?: string;
}

const Modal: React.FC<ModalProps> = ({
  titleIcon,
  title,
  children,
  isOpen,
  closeModal,
  modalActions,
  showCancel,
  cancelButtonText,
}) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, closeModal]);

  return (
    <>
      {isOpen && <div className="modal-overlay" onClick={closeModal}></div>}
      <dialog className="modal" open={isOpen}>
        <div className="modal-box flex flex-col gap-6">
          <div className="flex gap-4 items-center">
            {titleIcon} <h3 className="font-semibold">{title}</h3>
          </div>
          {children}
          <div className="modal-action w-full">
            <form
              method="dialog"
              className="w-full flex flex-row gap-6 justify-end"
            >
              {modalActions &&
                modalActions.map((modalAction) => (
                  <button
                    className={clsx(
                      "btn",
                      modalAction.color && `btn-${modalAction.color}`,
                      modalAction.size && `btn-${modalAction.size}`
                    )}
                    key={`${modalAction.name}-${modalAction.color}`}
                    type={modalAction.type || "button"}
                    onClick={modalAction.onClick}
                    disabled={modalAction.disabled}
                  >
                    {modalAction.name}
                  </button>
                ))}
              {showCancel && (
                <button className="btn" type="button" onClick={closeModal}>
                  {cancelButtonText || "Close"}
                </button>
              )}
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Modal;
