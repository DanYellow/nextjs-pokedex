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


    return createPortal(
        <dialog ref={dialogRef} className="w-10/12 mx-auto my-auto px-3 rounded-4xl border-2 border-solid backdrop:backdrop-blur-xs backdrop:bg-slate-400/50 overscroll-y-contain bg-gray-50">
            {children}
        </dialog>,
        document.getElementById('modal-container')!
    );
}

export default Modal;
