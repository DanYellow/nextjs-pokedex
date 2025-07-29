import { cache } from 'react';

import type { IPokemon, IPokemonError, IType } from "@/app/_types/Pokemon";

const serverErrorStartNumber = 400;

export const fetchPokemonForGeneration = cache(async (generation: number = 1) => {
    let hasFoundGeneration = true;
    try {
        const req: { status: number, json: () => Promise<IPokemon[]|IPokemonError> } = await fetch(`https://tyradex.vercel.app/api/v1/gen/${generation}`);

        const res = await req.json();
        const error = res as IPokemonError
        if (error.status >= serverErrorStartNumber) {
            hasFoundGeneration = false;
            throw new Error("");
        }

        return { hasFoundGeneration, data: res };
    } catch (error) {
        return { hasFoundGeneration, data: [] };
    }
})

export const fetchPokemon = async (pkmnId: number | string, region: string | null = null) => {
    try {
        const regionName = region ? `/${region}` : "";
        const req: { status: number, json: () => Promise<IPokemon | IPokemonError> } = await fetch(`https://tyradex.vercel.app/api/v1/pokemon/${pkmnId}${regionName}`);

        return req.json();
    } catch (error) {
        return { message: "Erreur" };
    }
}

export const fetchAllTypes = async () => {
    try {
        const req: { json: () => Promise<IType[]> } = await fetch("https://tyradex.app/api/v1/types");
        return req.json();
    } catch (error) {
        return [];
    }
}
