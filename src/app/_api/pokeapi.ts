import type { IPokemon, IPokemonType } from "@/app/_types/Pokemon";

export const fetchPokemonDetails = async (pkmnId: number) => {
    try {
        const req: { json: () => Promise<IPokemon[]> } = await fetch(`https://pokeapi.co/api/v2/pokemon/${pkmnId}`);
        return req.json();
    } catch (error) {
        throw new Error(error);
    }
}

export const fetchPokemonExternalData = async (pkmnId: number) => {
    try {
        const req = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pkmnId}`);
        return req.json();
    } catch (error) {
        throw new Error(error);
    }
}

export const fetchEvolutionChain = async (url: string) => {
    try {
        const req = await fetch(url);
        return req.json();
    } catch (error) {
        throw new Error(error);
    }
}

export const fetchAbilityData = async (url: string) => {
    try {
        const req = await fetch(url);
        return req.json();
    } catch (error) {
        throw new Error(error);
    }
}

