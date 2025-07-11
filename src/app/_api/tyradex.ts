import type { IPokemon, IPokemonType } from "@/app/_types/Pokemon";

export const fetchPokemonForGeneration = async (generation = 1) => {
    let hasReachedEnd = false;
    try {
        const req: { status: number, json: () => Promise<IPokemon[]> } = await fetch(`https://tyradex.vercel.app/api/v1/gen/${generation}`);

        const serverErrorStartNumber = 400;
        if (req.status >= serverErrorStartNumber) {
            hasReachedEnd = true;
            throw new Error("");
        }

        return { hasReachedEnd, data: await req.json() };
    } catch (error) {
        return { hasReachedEnd, data: [] };
    }
}

export const fetchPokemon = async (pkmnId: number, region: string|null = null) => {
    try {
        const regionName = region ? `/${region}` : "";
        const req: { json: () => Promise<IPokemon> } = await fetch(`https://tyradex.vercel.app/api/v1/pokemon/${pkmnId}${regionName}`);

        return req.json();
    } catch (error) {
        return null;
    }
}

export const fetchAllTypes = async () => {
    try {
        const req: { json: () => Promise<IPokemonType> } = await fetch("https://tyradex.app/api/v1/types");
        return req.json();
    } catch (error) {
        return [];
    }
}
