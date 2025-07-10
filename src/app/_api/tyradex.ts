
export const fetchPokemonForGeneration = async (generation = 1) => {
    try {
        const req: { status: number, json: () => object } = await fetch(`https://tyradex.vercel.app/api/v1/gen/${generation}`);

        const serverErrorStartNumber = 400;
        if (req.status >= serverErrorStartNumber) {
            throw new Error("" );
        }

        return req.json();
    } catch (error) {
        throw new Error("eee", { cause: error.cause });
    }
}

export const fetchPokemon = async (pkmnId: number, region: string|null = null) => {
    try {
        const regionName = region ? `/${region}` : "";
        const req: { json: () => object } = await fetch(`https://tyradex.vercel.app/api/v1/pokemon/${pkmnId}${regionName}`);

        return req.json();
    } catch (error) {
        throw new Error(error);
    }
}

export const fetchAllTypes = async () => {
    try {
        const req: { json: () => object } = await fetch("https://tyradex.app/api/v1/types");
        return req.json();
    } catch (error) {
        throw new Error(error);
    }
}
