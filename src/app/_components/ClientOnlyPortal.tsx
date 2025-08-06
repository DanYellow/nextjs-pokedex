import { useRef, useEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

export default function ClientOnlyPortal({ children, selector, onReady }: {children: ReactNode, selector: string, onReady?: Function}) {
    const ref = useRef<HTMLElement | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        ref.current = document.querySelector(selector);
        setIsMounted(true);
        setTimeout(() => {
            onReady?.();
        }, 150)
    }, [selector]);

    return isMounted ? createPortal(children, ref.current!) : null;
}
