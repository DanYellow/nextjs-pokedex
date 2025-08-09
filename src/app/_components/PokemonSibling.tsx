"use client";

import Image from "next/image";
import Link from "next/link";

import type { IPokemonCore } from "@/app/_types/Pokemon";

import { typesTextColorGroupHocus, typesBorderColor, cleanString } from "@/app/_utils";
import { loadPokemonPage } from "@/app/_utils/rippleEffect";

interface IPokemonSibling extends IPokemonCore {
    isCurrentPkmn: boolean;
    isPreviousPkmn: boolean;
}

export default ({ isCurrentPkmn, isPreviousPkmn, name, pokedex_id, sprites, types }: IPokemonSibling) => {
    if (isCurrentPkmn) {
        return (
            <div className={`
                pkmn-sibling h-full group-last:flex-row-reverse flex gap-5 items-center
            `}>
                <div>
                    <p className="text-sm">#{String(pokedex_id).padStart(4, '0')}</p>
                    <p>{name.fr}</p>
                </div>
            </div>
        )
    }
    const listTypes = types.map((item) => cleanString(item.name));
    const borderColor = typesBorderColor[`${listTypes[0]}_${listTypes[1] || listTypes[0]}`]

    return (
        <Link
            href={`/pokemon/${pokedex_id}`}
            className={`
                pkmn-sibling ripple-effect h-full group-last:flex-row-reverse
                flex gap-5 items-center group border-transparent
                transition-colors border-2 border-solid rounded-lg p-2 outline-offset-4
                ${borderColor}
            `}
            onClick={(e) => loadPokemonPage(e, listTypes)}
        >
            <p className={`group-hocus:scale-120 arrow ${isPreviousPkmn ? "-mr-3.5" : "-ml-3.5"} ${typesTextColorGroupHocus[listTypes[0]]}`}> {isPreviousPkmn ? "◄" : "►"}</p>

            <Image
                className="w-12"
                src={sprites.regular}
                alt={`sprite de ${name.fr}`}
                width={64}
                height={64}
                loading="lazy"
            />
            <div>
                <p className="text-sm">#{String(pokedex_id).padStart(4, '0')}</p>
                <p>{name.fr}</p>
            </div>
        </Link>
    )
}
