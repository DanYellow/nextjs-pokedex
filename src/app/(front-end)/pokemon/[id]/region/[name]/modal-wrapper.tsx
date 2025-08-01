'use client';

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = ({ children }: { children: React.ReactNode }) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (!dialogRef.current?.open) {
            dialogRef.current?.showModal();
        }
    }, []);

    if (typeof window !== "object") {
        return null;
    }

    return createPortal(
        <dialog ref={dialogRef} className={`sm:max-w-4xl w-full mx-auto my-auto px-6 pb-2 rounded-4xl backdrop:bg-slate-400/50 overscroll-y-contain bg-gray-50 border-solid border-2 border-(color:--dot-type-1-pip-color)`}>
            {children}
        </dialog>,
        document.getElementById('modal-container')!
    );
}

export default Modal;
