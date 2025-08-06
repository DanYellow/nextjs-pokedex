"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

import { IPokemonForm, IPokemonType } from "@/app/_types/Pokemon";
import { cleanString, typesAnimatedBorderColor } from "../_utils";
import { loadPokemonPage } from "../_utils/rippleEffect";
import React, { ReactNode } from "react";
import { useModal } from "../(front-end)/pokemon/[id]/region/[name]/modal-wrapper";

interface IPokemonFormComplete extends Omit<IPokemonForm, "name"> {
    pokedex_id: number;
    form_id?: number;
    listTypes: IPokemonType[];
    name: string;
    sprites: {
        regular: string;
    };
    handleCloseModal?: () => void;
}

const PokemonForm = ({ region, name, pokedex_id, form_id, listTypes, sprites }: IPokemonFormComplete) => {

    let url = `/pokemon/${pokedex_id}`
    if (region) {
        url += `/region/${region}?id=${form_id}`;
    }

    const pathname = usePathname();
    const searchParams = useSearchParams()
    const router = useRouter()
    const { onClose } = useModal();

    const listTypesString = listTypes.map((item) => cleanString(item.name));
    const listBorderClasses = typesAnimatedBorderColor[`${listTypesString[0]}_${listTypesString?.[1] || listTypesString[0]}`]

    const isCurrentURL = (`${pathname}?${searchParams.toString()}` === url);

    const CustomTag = isCurrentURL ? (
        ({ children, className }: { children: ReactNode, className: string }) => (
            <Link
                href={url}
                className={className}
                onClick={(e) => loadPokemonPage(e, listTypesString)}
                inert={isCurrentURL}
            >{children}</Link>
        )
    ) : (
        ({ children, className }: { children: ReactNode, className: string }) => (
            <button type="button" className={className} onClick={() => {
                onClose();
                history.pushState({}, "", `/pokemon/${pokedex_id}`);
            }}
            >
                {children}
            </button>
        )
    )

    return (
        <CustomTag className={`
            bg-slate-100 rounded-xl p-3 ${isCurrentURL ? "selected" : ""}
            hocus:bg-transparent transition-colors
            flex flex-col items-center ${listBorderClasses}
            ripple-effect border-transparent border-solid border-2 border-type-animated
            inert:opacity-65 w-full
        `}>
            <Image
                src={sprites.regular}
                alt={`sprite de ${name}`}
                width={175}
                height={38}
                priority
            />
            <p className="text-center px-2">{name}</p>
            <ul className="flex gap-1 flex-row justify-center">
                {listTypes.map(({ name: type, image }: IPokemonType, idx) => (
                    <li
                        key={type}
                        className="py-0.5 px-2 rounded-md gap-1 flex items-center type-name w-fit"
                        aria-label={`Type ${idx + 1} ${type}`}
                        style={{
                            backgroundColor: `var(--type-${cleanString(type)})`
                        }}
                    >
                        <img className="h-5" src={image} alt={`icône type ${name}`} />
                        {type}
                    </li>
                ))}
            </ul>
        </CustomTag>
    )
}

export default PokemonForm
