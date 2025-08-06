"use client";

import ClientOnlyPortal from "@/app/_components/ClientOnlyPortal";
import { useRef } from "react";

const Modal = ({ children }: { children: React.ReactNode }) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const onPortalReady = () => {
        if (!dialogRef.current?.open) {
            dialogRef.current?.showModal();
        }
    };

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
