import type { IPokemon, IPokemonType, IPokemonError } from "@/app/_types/Pokemon";

const serverErrorStartNumber = 400;

export const fetchPokemonForGeneration = async (generation = 1) => {
    let hasReachedEnd = false;
    try {
        const req: { status: number, json: () => Promise<IPokemon[]> } = await fetch(`https://tyradex.vercel.app/api/v1/gen/${generation}`);

        if (req.status >= serverErrorStartNumber) {
            hasReachedEnd = true;
            throw new Error("");
        }

        return { hasReachedEnd, data: await req.json() };
    } catch (error) {
        return { hasReachedEnd, data: [] };
    }
}

export const fetchPokemon = async (pkmnId: number, region: string | null = null) => {
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
        const req: { json: () => Promise<IPokemonType> } = await fetch("https://tyradex.app/api/v1/types");
        return req.json();
    } catch (error) {
        return [];
    }
}
