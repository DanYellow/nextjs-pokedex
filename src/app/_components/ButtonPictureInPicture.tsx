"use client";

import { createRoot } from 'react-dom/client';

import { ReactNode, useEffect, useState } from "react";

declare global {
  interface Window {
    documentPictureInPicture?: any;
  }
}

const ButtonPictureInPicture = ({ pipContent }: { pipContent: ReactNode }) => { // { modal }: { modal: HTMLDialogElement }
    const [modal, setModal] = useState<HTMLDialogElement | null>(null);

    useEffect(() => {
        setModal(document.querySelector("dialog"));
    }, [])

    if (!("documentPictureInPicture" in window)) {
        return null;
    }


    const togglePictureInPicture = async () => {
        if (!modal) {
            return null;
        }

        if (window.documentPictureInPicture.window!) {
            window.documentPictureInPicture.window.close();
            return;
        } else {
            // const pipIndicator = document.querySelector("[data-pip-enabled]");
            // pipIndicator.removeAttribute("hidden");

            const pipOptions = {
                initialAspectRatio: modal!.clientWidth / modal!.clientHeight,
                lockAspectRatio: true,
                copyStyleSheets: true,
            };
            const pipWindow = await window.documentPictureInPicture.requestWindow(
                pipOptions
            );

            const handlePipClose = () => {
                window.documentPictureInPicture!.window.close();
            }

            Array.from(document.scripts).forEach((item) => {
                const scriptTag = document.createElement("script");
                scriptTag.src = item.src;
                scriptTag.type = "module";
                pipWindow.document.head.append(scriptTag);
            });

            ;[...document.styleSheets].forEach((styleSheet) => {
                try {
                    const cssRules = [...styleSheet.cssRules]
                        .map((rule) => rule.cssText)
                        .join("");
                    const style = document.createElement("style");

                    style.textContent = cssRules;
                    pipWindow.document.head.appendChild(style);
                } catch (_e) {
                    const link = document.createElement("link");
                    link.rel = "stylesheet";
                    link.type = styleSheet.type;
                    link.media = styleSheet.media.mediaText;
                    link.href = styleSheet.href as string;
                    pipWindow.document.head.appendChild(link);
                }
            });

            pipWindow.document.body.classList.add("pip-dots");

            const pipContainer = pipWindow.document.createElement("div") as HTMLDivElement;
            pipWindow.document.documentElement.style.cssText = document.documentElement.style.cssText;

            pipContainer.setAttribute("id", "pip-root");
            pipWindow.document.body.append(pipContainer);

            const PIP_ROOT = createRoot(
                pipWindow.document.getElementById("pip-root")
            );

            PIP_ROOT.render(
                <div className='sm:max-w-4xl w-full bg-gray-50 min-h-screen px-6 pb-4 my-auto mx-auto border-x-solid border-x border-x-(color:--dot-type-1-pip-color)'>
                    {pipContent}
                </div>
            );

            modal.close();

            // const closeModalBtn = pipWindow.document.querySelector("[data-close-modal]");
            // closeModalBtn.addEventListener("click", handlePipClose);

            pipWindow.addEventListener("pagehide", () => {
                if (modal) {
                    // pipIndicator.setAttribute("hidden", "");
                    // closeModalBtn.removeEventListener("click", handlePipClose)
                }
                modal.showModal();
            });
        }
    };


    return (
        <button
            type="button"
            className="rounded-sm absolute px-1.5 right-0 top-0 hocus:text-(color:--dot-type-1-pip-color) toggle-pip-btn grid overflow-x-clip whitespace-nowrap group-picture-in-picture:hidden"
            onClick={togglePictureInPicture}
        >
            <svg fill="none" style={{ scale: 0.75, translate: "10% 0" }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6.25C2 4.45507 3.45507 3 5.25 3H18.75C20.5449 3 22 4.45507 22 6.25V12H20.5V6.25C20.5 5.2835 19.7165 4.5 18.75 4.5H5.25C4.2835 4.5 3.5 5.2835 3.5 6.25V15.75C3.5 16.7165 4.2835 17.5 5.25 17.5H11V19H5.25C3.45507 19 2 17.5449 2 15.75V6.25ZM14 13C12.8954 13 12 13.8954 12 15V20C12 21.1046 12.8954 22 14 22H21C22.1046 22 23 21.1046 23 20V15C23 13.8954 22.1046 13 21 13H14ZM5.21967 6.21967C5.51256 5.92678 5.98744 5.92678 6.28033 6.21967L9.5 9.43934V7.75C9.5 7.33579 9.83579 7 10.25 7C10.6642 7 11 7.33579 11 7.75V11.25C11 11.6642 10.6642 12 10.25 12H6.75C6.33579 12 6 11.6642 6 11.25C6 10.8358 6.33579 10.5 6.75 10.5H8.43934L5.21967 7.28033C4.92678 6.98744 4.92678 6.51256 5.21967 6.21967Z" fill="currentColor"></path>
            </svg>
            <p className="text-black content-center ml-1.5">Ouvrir dans une fenêtre</p>
        </button>
    )
}

export default ButtonPictureInPicture;
