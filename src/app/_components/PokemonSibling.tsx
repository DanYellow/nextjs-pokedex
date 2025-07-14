"use client";

import Image from "next/image";
import type { IPokemonCore } from "@/app/_types/Pokemon";
import { typesTextColorGroupHocus, typesBorderColor, cleanString } from "../_utils";
import Link from "next/link";

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
    const borderColor = typesBorderColor[`${cleanString(types[0].name)}_${cleanString(types[1]?.name || types?.[0].name)}`]

    return (
        <Link
            href={`/pokemon/${pokedex_id}`}
            className={`
                pkmn-sibling ripple-effect h-full group-last:flex-row-reverse
                flex gap-5 items-center group border-transparent
                transition-colors border-2 border-solid rounded-lg p-2 outline-offset-4
                ${borderColor}
            `}
        >
            <p className={`group-hocus:scale-120 arrow ${isPreviousPkmn ? "-mr-3.5" : "-ml-3.5"} ${typesTextColorGroupHocus[cleanString(types[0].name)]}`}> {isPreviousPkmn ? "◄" : "►"}</p>

            <Image
                className="w-12"
                src={sprites.regular}
                alt={`sprite de ${name.fr}`}
                width={175}
                height={38}
                loading="lazy"
            />
            <div>
                <p className="text-sm">#{String(pokedex_id).padStart(4, '0')}</p>
                <p>{name.fr}</p>
            </div>
        </Link>
    )
}
