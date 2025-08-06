"use client";

import ClientOnlyPortal from "@/app/_components/ClientOnlyPortal";
import { Children, cloneElement, isValidElement, ReactElement, useRef } from "react";


interface InjectedProps {
    handleClose?: () => void;
}
const Modal = ({ children }: { children: React.ReactNode }) => {
    if (children && isValidElement(children) && Children.toArray(children).length !== 1) {
        throw new Error("Slot must have exactly one child element");
    }

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
        <ClientOnlyPortal selector="#modal-container" onReady={onPortalReady}>
            <dialog
                ref={dialogRef}
                className={`sm:max-w-4xl w-full mx-auto my-auto px-6 pb-2 rounded-4xl backdrop:bg-slate-400/50 overscroll-y-contain bg-gray-50 border-solid border-2 border-(color:--modal-border-color)`}
            >
                {Children.map(children, (child) => {
                    if (isValidElement(child)) {

                        return cloneElement<InjectedProps>(child as ReactElement, {
                            handleClose: onClose,
                        });
                    }

                    return child;
                })}
            </dialog>
        </ClientOnlyPortal>
    );
};

export default Modal;
