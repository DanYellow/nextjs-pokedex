"use client";

import ClientOnlyPortal from "@/app/_components/ClientOnlyPortal";
import { useNavigation } from "@/app/_contexts/NavigationContext";
import { useContext, useRef, createContext, useState, useEffect } from "react";

interface IModalContext {
    closeModal: () => void;
    openModal: () => void;
}

const ModalContext = createContext<IModalContext>({
    closeModal: () => { },
    openModal: () => { },
});

const Modal = ({ children }: { children: React.ReactNode }) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const { setPreviousURL } = useNavigation();

    const onPortalReady = () => {
        if (!dialogRef.current?.open) {
            dialogRef.current?.showModal();
        }
    };

    // useEffect(() => {
    //     if (dialogRef.current?.open) {
    //         dialogRef.current?.close();
    //     }
    //     console.log("previousURL", previousURL)
    //     window.previousURL = previousURL;
    // }, [previousURL])

    // useEffect(() => {
    //     console.log("modal")
    // }, [])

    const onClose = () => {
        if (dialogRef.current?.open) {
            setPreviousURL(`${document.location.pathname}${document.location.search}`);
            dialogRef.current?.close();
        }
    }

    const onOpen = () => {
                            console.log("onOpen")
        dialogRef.current?.showModal();
        if (!dialogRef.current?.open) {
            dialogRef.current?.showModal();
        }
    }

    return (
        <ModalContext value={{ closeModal: onClose, openModal: onOpen }}>
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
