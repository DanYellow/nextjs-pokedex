"use client";

import { useEffect } from "react";
import { cleanString } from "@/app/_utils";

export default ({ types }: { types: string[] }) => {

    useEffect(() => {
        const r = document.querySelector(':root') as HTMLElement;
        if (r) {
            document.body.classList.add("bg-dots");
            // const typeColor = window.getComputedStyle(document.body).getPropertyValue(`--type-${cleanString(types[0])}`)
            // document.querySelector('meta[name="theme-color"]').setAttribute("content", typeColor);

            r.style.setProperty('--dot-type-1-color', `var(--type-${cleanString(types[0])})`);
            r.style.setProperty('--dot-type-2-color', `var(--type-${cleanString(types?.[1] || types[0])})`);
        }
    }, []);

    return null;
}
