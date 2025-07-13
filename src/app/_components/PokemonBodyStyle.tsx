"use client";

import { useEffect } from "react";
import { cleanString } from "@/app/_utils";

export default ({ types }: { types: string[] }) => {
    useEffect(() => {
        const r = document.querySelector(':root') as HTMLElement;
        if (r) {
            document.body.classList.add("bg-dots");
            r.style.setProperty('--dot-color-1', `var(--type-${cleanString(types[0])})`);
            r.style.setProperty('--dot-color-2', `var(--type-${cleanString(types?.[1] || types[0])})`);
        }
    }, []);

    return <></>;
}
