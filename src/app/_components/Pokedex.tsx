"use client";

import { useContext } from 'react';

import type { IPokemon } from "@/app/_types/Pokemon";
import PokedexEntry from "@/app/_components/PokedexEntry";

import { useLayout } from '@/app/_contexts/LayoutContext';

export default ({ data }: { data: IPokemon[] }) => {
    const { layout } = useLayout();
    const listClasses = [
        ...(layout === "grid" ? ["grid-cols-3", "md:grid-cols-5", "lg:grid-cols-6"] : []),
        ...(layout === "list" ? ["grid-cols-1"] : []),
    ];

    return (
        <ol className={`pokedex grid gap-4 mb-4 mx-auto max-w-6xl mt-2 ${listClasses.join(" ")}`}>
            {data.map((pokemon: IPokemon) => (
                <PokedexEntry
                    key={pokemon.pokedex_id}
                    id={pokemon.pokedex_id}
                    name={pokemon.name.fr}
                    sprite={pokemon.sprites.regular}
                    listTypes={pokemon.types}
                />
            ))}
        </ol>
    );
}
