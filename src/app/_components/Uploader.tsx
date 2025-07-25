"use client";

import { useRef, useState } from "react";
import style from "./uploader.module.css";

const SCALE_CLASS = "scale-102";

type ErrorMessageImage = {
    message?: string;
    type?: string;
}
const imageValidator = (image: File, listAllowedMimeType = ["image/png", "image/jpg", "image/jpeg", "image/avif"], maxSizeFactor = 0.8): ErrorMessageImage => {
    if (
        !listAllowedMimeType.includes(image.type)
    ) {
        return { message: "Format incorrect uploadé", type: "incorrect_format" };
    }

    const oneMo = 1024 * 1024;
    const fileLimit = oneMo * maxSizeFactor; // 800kB
    if (image.size > fileLimit) {
        const limitHundred = Math.floor(maxSizeFactor * 1024 / 100) * 100;
        return {
            message: `Fichier trop lourd (${(image.size / oneMo).toFixed(2)} MB). ${limitHundred} kB maximum.`,
            type: "upload_size",
        };
    }

    return {};
};

const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "kB", "MB", "GB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${String(parseFloat((bytes / Math.pow(k, i)).toFixed(dm))).replace(".", ",")} ${sizes[i]}`;
}

const Uploader = ({ classNames = "" }: { classNames?: string }) => {
    const inputFile = useRef<HTMLInputElement>(null);
    const folderDiv = useRef<HTMLDivElement>(null);

    const [image, setImage] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [uploadHasError, setUploadHasError] = useState(false);

    const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        if (e.currentTarget.classList.contains(SCALE_CLASS)) {
            return;
        }

        folderDiv.current?.classList.add("open");
        e.currentTarget.classList.add(SCALE_CLASS);
    }

    const dragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove(SCALE_CLASS);
        folderDiv.current?.classList.remove("open");
    }

    const drop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.remove(SCALE_CLASS);
        folderDiv.current?.classList.remove("open");
        setErrorMessage(undefined);

        if (e.dataTransfer.items && inputFile.current) {
            inputFile.current.files = e.dataTransfer.files;
            const file = e.dataTransfer.files[0];
            const errorMessage = imageValidator(file);

            if (Object.keys(errorMessage).length) {
                setUploadHasError(true);
                setErrorMessage(errorMessage.message);
            } else {
                setImage(file);
            }
        }
    }

    const change = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0] || null;
        setImage(file);
    }

    const deleteImage = () => {
        setImage(null);
        if (inputFile.current) {
            inputFile.current.files = null;
        }
    }

    const animationEnd = (e: React.SyntheticEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove(style["upload-error"]);
        setUploadHasError(false);

    }

    return (
        <div className={classNames}>
            <div
                className={`duration-750 relative z-50 shadow-2xl transition-transform p-5 rounded-2xl bg-slate-100 aspect-[2/1] ${uploadHasError ? style["upload-error"] : ""}`}
                onDragOver={dragOver}
                onDragLeave={dragLeave}
                onDrop={drop}
                onAnimationEnd={animationEnd}
            >
                <div className="bg-slate-200 w-full flex flex-col ease-in-out items-stretch p-5 border-slate-600 border-dashed border-2 rounded-2xl relative z-50">
                    <div className="folder self-center scale-70" ref={folderDiv}>
                        <div className="folder-back">
                        </div>
                        <div className="folder-front"></div>
                        <div className="folder-right"></div>
                    </div>

                    <p className="text-center font-bold text-lg text-slate-600">Glissez-déposez votre image</p>

                    <p className={`${style.separator} text-center my-4`}>
                        <span className="font-semibold text-slate-600 z-10 bg-slate-200 relative px-3">OU</span>
                    </p>
                    <label htmlFor="cover" className="text-sm
                        py-2 px-4
                        rounded-sm border-0
                        bg-blue-700 hocus:bg-blue-950 focus-within:bg-blue-950
                        text-white text-center
                        mx-auto
                    ">
                        Sélectionnez un fichier
                        <input ref={inputFile} type="file" onChange={change} className="w-0 h-0 file:hidden -z-50" required name="cover" id="cover" accept=".jpg, .jpeg, .avif, .png" />
                    </label>
                </div>
                {errorMessage && (
                    <p className="bg-red-700 px-5 py-2 my-3 text-white rounded-2xl">{errorMessage}</p>
                )}
                {image && (
                    <div className={`flex shadow-2xl w-full mx-auto border border-slate-400 border-solid flex-row mt-8 bg-slate-100 rounded-2xl px-3 py-2 gap-2 ${style.image}`}>
                        <img className="size-15 object-contain" src={URL.createObjectURL(image)} alt="" />
                        <div>
                            <p>{image.name}</p>
                            <p className="text-sm">{formatBytes(image.size)}</p>
                        </div>
                        <button type="button" onClick={deleteImage} className="ml-auto text-2xl">&#x2716;</button>
                    </div>
                )}
            </div>
        </div>
    )
}


export default Uploader;
