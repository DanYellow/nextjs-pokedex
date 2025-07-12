"use client";

import Link from 'next/link';

import type { IPokemon } from "@/app/_types/Pokemon";
import PokedexEntry from "@/app/_components/PokedexEntry";

import { useLayout } from '@/app/_contexts/LayoutContext';

import pkdexStyle from "./pokedex.module.css";

const MAX_GENERATION = 9;

const DexLink = ({ generation }: { generation: number; }) => {
    return (
        <li className="border-2 border-black rounded-md  bg-gray-200  hocus:text-white @container/pokemon overflow-hidden">
            <Link data-generation={generation} href={`?id=${generation}`} className={`block hocus:bg-gray-500 p-2 w-full h-full ${pkdexStyle["pkdex-link"]} @sm/pokemon:h-16 transition-colors`}>
                Aller à la <span className='font-bold text-lg text-wrap'>GÉNÉRATION #{generation}</span>
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
        <ol className={`pokedex grid gap-4 mb-4 mx-auto max-w-6xl mt-2 ${listClasses.join(" ")}`}>
            {currentGeneration > 1 ? (
                <DexLink generation={currentGeneration - 1} />
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
                <DexLink generation={currentGeneration + 1} />
            ) : null}
        </ol>
    );
}
