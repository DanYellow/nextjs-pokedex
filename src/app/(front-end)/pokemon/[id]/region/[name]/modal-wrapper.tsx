"use client";

import ClientOnlyPortal from "@/app/_components/ClientOnlyPortal";
import { Children, isValidElement, useContext, useRef, createContext } from "react";

interface IModalContext {
    onClose: () => void;
}

const ModalContext = createContext<IModalContext>({
    onClose: () => { }
});

const Modal = ({ children }: { children: React.ReactNode }) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const onPortalReady = () => {
        if (!dialogRef.current?.open) {
            dialogRef.current?.showModal();
        }
    };

    const onClose = () => {
        if (dialogRef.current?.open) {
            dialogRef.current?.close();
        }
    }

    return (
        <ModalContext value={{ onClose }}>
            <ClientOnlyPortal selector="#modal-container" onReady={onPortalReady}>
                <dialog
                    ref={dialogRef}
                    className={`sm:max-w-4xl w-full mx-auto my-auto px-6 pb-2 rounded-4xl backdrop:bg-slate-400/50 overscroll-y-contain bg-gray-50 border-solid border-2 border-(color:--modal-border-color)`}
                >
                    {children}
                </dialog>
            </ClientOnlyPortal>
        </ModalContext>
    );
};

export default Modal;

export const useModal = () => useContext<IModalContext>(ModalContext);
