"use client";

import { useRef } from "react";
import Link from 'next/link';

import type { IPokemon } from "@/app/_types/Pokemon";
import PokedexEntry from "@/app/_components/PokedexEntry";

import { useLayout } from '@/app/_contexts/LayoutContext';

import pkdexStyle from "./pokedex.module.css";

const MAX_GENERATION = 9;

const DexLink = ({ generation, isLast }: { generation: number; isLast: boolean; }) => {
    const linkRef = useRef<HTMLAnchorElement>(null);

    return (
        <li className="@container/pokemon col-span-2 sm:col-auto">
            <Link
                href={`?id=${generation}`}
                className={`
                    block hocus:bg-gray-500 bg-gray-200 hocus:text-white
                    p-2 w-full h-full ${pkdexStyle["pkdex-link"]} @sm/pokemon:h-16
                    transition-colors overflow-hidden border-2 border-black rounded-md
                    @sm/pokemon:after:!content-none
                    ${isLast ? "after:-scale-x-100" : ""}
                `}
                onMouseEnter={() => {
                    if (linkRef.current) {
                        linkRef.current.style.setProperty('--random-value', String(Math.floor(Math.random() * 50)))
                    }
                }}
                ref={linkRef}
            >
                Aller à la <span className='font-bold text-lg text-wrap'>GÉNÉRATION #{generation}</span>

                {Array.from({ length: 6 }).map((_, idx) => {
                    return (
                        <p
                            key={idx}
                            aria-hidden="true"
                            className={`${pkdexStyle["generation-number"]}`}
                            inert
                        >
                            {generation}
                        </p>
                    )
                })}
            </Link>
        </li>
    )
}

export default ({ data }: { data: IPokemon[]; }) => {
    const { layout } = useLayout();
    const listClasses = [
        ...(layout === "grid" ? ["grid-cols-3", "md:grid-cols-5", "lg:grid-cols-6"] : []),
        ...(layout === "list" ? ["grid-cols-1"] : []),
    ];

    if (!layout) {
        return null;
    }

    const currentGeneration = data[0].generation;

    return (
        <ol className={`pokedex grid gap-4 mb-4 mx-auto max-w-6xl mt-2 auto-rows-fr ${listClasses.join(" ")}`}>
            {currentGeneration > 1 ? (
                <DexLink generation={currentGeneration - 1} isLast={false} />
            ) : null}

            {data.map((pokemon: IPokemon) => (
                <PokedexEntry
                    key={pokemon.pokedex_id}
                    id={pokemon.pokedex_id}
                    name={pokemon.name.fr}
                    sprite={pokemon.sprites.regular}
                    listTypes={pokemon.types}
                />
            ))}
            {currentGeneration < MAX_GENERATION ? (
                <DexLink generation={currentGeneration + 1} isLast={true} />
            ) : null}
        </ol>
    );
}
