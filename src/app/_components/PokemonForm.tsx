"use client";

import { IPokemonForm, IPokemonType } from "@/app/_types/Pokemon";
import Image from "next/image";
import Link from "next/link";
import { cleanString } from "../_utils";
import { loadPokemonPage } from "../_utils/rippleEffect";


interface IPokemonFormComplete extends Omit<IPokemonForm, "name"> {
    pokedex_id: number;
    form_id?: number;
    listTypes: IPokemonType[];
    name: string;
    sprites: {
        regular: string;
    }
}

const PokemonForm = ({ region, name, pokedex_id, form_id, listTypes, sprites }: IPokemonFormComplete) => {
    let url = `/pokemon/${pokedex_id}`
    if (region) {
        url += `/region/${region}?id=${form_id}`;
    }

    return (
        <Link
            href={url}
            className="bg-slate-100 rounded-xl p-3 hocus:bg-transparent transition-colors flex flex-col items-center ripple-effect"
            onClick={(e) => loadPokemonPage(e, listTypes.map((item) => item.name))}
        >
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
        </Link>
    )
}

export default PokemonForm
