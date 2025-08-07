"use client";

import ClientOnlyPortal from "@/app/_components/ClientOnlyPortal";
import { useModal } from "@/app/_contexts/ModalContext";
import { useNavigation } from "@/app/_contexts/NavigationContext";
import { useRef, useEffect } from "react";

const Modal = ({ children }: { children: React.ReactNode }) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const { setIsModalOpen, isModalOpen } = useModal();
    const { setPreviousURL } = useNavigation();

    const onPortalReady = () => {
        if (!dialogRef.current?.open) {
            setIsModalOpen(true);
        }
    };

    useEffect(() => {
        if (dialogRef.current) {
            if (isModalOpen) {
                dialogRef.current.showModal();
            } else {
                dialogRef.current.close();
            }
        }
    }, [isModalOpen]);

    return (
        <ClientOnlyPortal selector="#modal-container" onReady={onPortalReady}>
            <dialog
                ref={dialogRef}
                className={`sm:max-w-4xl w-full mx-auto my-auto px-6 pb-2 rounded-4xl backdrop:bg-slate-400/50 overscroll-y-contain bg-gray-50 border-solid border-2 border-(color:--modal-border-color)`}
            >
                {children}
            </dialog>
        </ClientOnlyPortal>
    );
};

export default Modal;

