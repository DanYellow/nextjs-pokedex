"use client";

import { useRef, useState } from "react";
import style from "./uploader.module.css";

const SCALE_CLASS = "scale-105";
const Uploader = ({ classNames = "" }: { classNames?: string }) => {
    const inputFile = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<File | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

    const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(true);
        if (e.currentTarget.classList.contains(SCALE_CLASS)) {
            return;
        }
        e.currentTarget.classList.add(SCALE_CLASS);
    }

    const dragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove(SCALE_CLASS);
        setIsDraggingOver(false);
    }

    const drop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        e.currentTarget.classList.remove(SCALE_CLASS);
        setIsDraggingOver(false);

        if (e.dataTransfer.items && inputFile.current) {
            inputFile.current.files = e.dataTransfer.files;
            const file = e.dataTransfer.files[0];
            setImage(file);
        }
    }

    const change = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files[0];
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
                    {/* {isDraggingOver ? (
                        <svg viewBox="0 0 256 256" className="size-10 mx-auto">
                            <g style={{ stroke: "none", strokeWidth: 0, strokeDasharray: "none", strokeLinecap: "butt", strokeLinejoin: "miter", strokeMiterlimit: 10, fill: "none", fillRule: "nonzero", opacity: 1, }} transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                                <path d="M 73.538 35.162 l -52.548 1.952 c -1.739 0 -2.753 0.651 -3.232 2.323 L 6.85 76.754 c -0.451 1.586 -2.613 2.328 -4.117 2.328 h 0 C 1.23 79.082 0 77.852 0 76.349 l 0 -10.458 V 23.046 v -2.047 v -6.273 c 0 -2.103 1.705 -3.808 3.808 -3.808 h 27.056 c 1.01 0 1.978 0.401 2.692 1.115 l 7.85 7.85 c 0.714 0.714 1.683 1.115 2.692 1.115 H 69.73 c 2.103 0 3.808 1.705 3.808 3.808 v 1.301 C 73.538 26.106 73.538 35.162 73.538 35.162 z" style={{ stroke: "none", strokeWidth: 1, strokeDasharray: "none", strokeLinecap: "butt", strokeLinejoin: "miter", strokeMiterlimit: 10, fill: "rgb(224,173,49)", fillRule: "nonzero", opacity: 1, }} transform=" matrix(1 0 0 1 0 0) " strokeLinecap="round" />
                                <path d="M 2.733 79.082 L 2.733 79.082 c 1.503 0 2.282 -1.147 2.733 -2.733 l 10.996 -38.362 c 0.479 -1.672 2.008 -2.824 3.748 -2.824 h 67.379 c 1.609 0 2.765 1.546 2.311 3.09 L 79.004 75.279 c -0.492 1.751 -1.571 3.818 -3.803 3.803 C 75.201 79.082 2.733 79.082 2.733 79.082 z" style={{ stroke: "none", strokeWidth: 1, strokeDasharray: "none", strokeLinecap: "butt", strokeLinejoin: "miter", strokeMiterlimit: 10, fill: "rgb(255,200,67)", fillRule: "nonzero", opacity: 1, }} transform=" matrix(1 0 0 1 0 0) " strokeLinecap="round" />
                            </g>
                        </svg>

                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10 mx-auto">
                            <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
                        </svg>
                    )} */}

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
                        <input ref={inputFile} type="file" onChange={change} className="w-0 h-0 file:hidden -z-50" required name="cover" id="cover" />
                    </label>
                </div>
            </div>
            {image && (
                <div className={`flex w-9/12 mx-auto flex-row -mt-5 pt-8 bg-slate-100 rounded-2xl px-5 py-2 gap-2 border border-slate-600 border-solid ${style.image}`}>
                    <img className="size-15 object-contain" src={URL.createObjectURL(image)} alt="" />
                    <p>{image.name}</p>
                    <button type="button" onClick={deleteImage} className="ml-auto text-2xl">&#x2716;</button>
                </div>
            )}
        </div>
    )
}


export default Uploader;
