"use client";

import { useEffect } from "react";
import { cleanString } from "@/app/_utils";

export default ({ types, regionalTypes }: { types?: string[], regionalTypes?: string[] }) => {
    useEffect(() => {
        const r = document.querySelector(':root') as HTMLElement;
        if (r) {
            document.body.classList.add("bg-dots");

            if (types) {
                r.style.setProperty('--dot-type-1-color', `var(--type-${cleanString(types[0])})`);
                r.style.setProperty('--dot-type-2-color', `var(--type-${cleanString(types?.[1] || types[0])})`);
            }

            if (regionalTypes) {
                r.style.setProperty('--modal-border-color', `var(--type-${cleanString(regionalTypes[0])})`);
            }
        }
    }, []);

    return null;
}
