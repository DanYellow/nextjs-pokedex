"use client";

import { useRef, useState } from "react";
import style from "./uploader.module.css";

const SCALE_CLASS = "scale-105";
const Uploader = ({ classNames = "" }: { classNames?: string }) => {
    const inputFile = useRef<HTMLInputElement>(null);
    const folderDiv = useRef<HTMLDivElement>(null);

    const [image, setImage] = useState<File | null>(null);

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

        if (e.dataTransfer.items && inputFile.current) {
            inputFile.current.files = e.dataTransfer.files;
            const file = e.dataTransfer.files[0];
            setImage(file);
        }
    }

    const change = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0] || null;
        setImage(file);
    }

    const deleteImage = (e: React.SyntheticEvent<HTMLButtonElement>) => {
        setImage(null);
        if (inputFile.current) {
            inputFile.current.files = null;
        }
    }

    return (
        <div className={`w-full ${classNames}`}>
            <div
                className="duration-750 relative z-50 shadow-2xl transition-transform p-5 rounded-2xl bg-slate-100"
                onDragOver={dragOver}
                onDragLeave={dragLeave}
                onDrop={drop}
            >
                <div className="bg-slate-200 w-full flex flex-col ease-in-out items-stretch p-5 border-slate-600 border-dashed border-2 rounded-2xl ">
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
                        Sélectionner fichier
                        <input ref={inputFile} type="file" onChange={change} className="w-0 h-0 file:hidden -z-50" required name="cover" id="cover" accept=".jpg, .jpeg, .avif, .png" />
                    </label>
                </div>
            </div>
            {image && (
                <div className={`flex w-9/12 mx-auto flex-row -mt-5 pt-8 bg-slate-100 rounded-2xl px-3 py-2 gap-2 border border-slate-600 border-solid ${style.image}`}>
                    <img className="size-15 object-contain" src={URL.createObjectURL(image)} alt="" />
                    <p>{image.name}</p>
                    <button type="button" onClick={deleteImage} className="ml-auto text-2xl">&#x2716;</button>
                </div>
            )}
        </div>
    )
}


export default Uploader;
