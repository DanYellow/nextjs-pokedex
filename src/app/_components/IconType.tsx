"use client";

import { useEffect, useRef } from "react";

export default ({ type }: { type: { fr: string; en: string; } }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        (async () => {
            const svgTypeIconReq = await fetch(`http://localhost:3000/images/types-icons/${type.en}.svg`);
            const parser = new DOMParser();
            const svgTypeIcon = parser.parseFromString(
                await svgTypeIconReq.text(),
                "image/svg+xml"
            );
            svgTypeIcon.documentElement.setAttribute("role", "img");
            svgTypeIcon.documentElement.setAttribute("aria-labelledby", `icône type ${type.fr}`);
            svgTypeIcon.documentElement.querySelectorAll("[class]").forEach((item) => {
                if (item.classList.contains("cls-1")) {
                    return;
                }
                (item as HTMLElement).style.fill = window.getComputedStyle(document.body).getPropertyValue(`--type-${type.fr}`);
            })

            if (containerRef.current && !containerRef.current.hasChildNodes()) {
                containerRef.current.style.backgroundColor = window.getComputedStyle(document.body).getPropertyValue(`--type-${type.fr}`)
                containerRef.current.appendChild(svgTypeIcon.documentElement)
            }
        })()
    }, [])

    return (
        <div
            className="rounded-md content-center aspect-square size-12"
            ref={containerRef}
        />
    );
}
