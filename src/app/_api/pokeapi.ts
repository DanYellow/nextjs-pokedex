import type { IPokemonExtraData } from "@/app/_types/Pokeapi";

export const fetchPokemonDetails = async (pkmnId: number) => {
    try {
        const req: { json: () => Promise<IPokemonExtraData> } = await fetch(`https://pokeapi.co/api/v2/pokemon/${pkmnId}`);
        return req.json();
    } catch (error) {
        return {};
    }
}

export const fetchPokemonExternalData = async (pkmnId: number) => {
    try {
        const req = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pkmnId}`);
        return req.json();
    } catch (error) {
        return {};
    }
}

export const fetchEvolutionChain = async (url: string) => {
    try {
        const req = await fetch(url);
        return req.json();
    } catch (error) {
        return {};
    }
}

export const fetchAbilityData = async (url: string) => {
    try {
        const req = await fetch(url);
        return req.json();
    } catch (error) {
        return {};
    }
}

