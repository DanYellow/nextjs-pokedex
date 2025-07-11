
interface IPokemonType {
    name: string;
    image: string;
}

interface IPokemon {
    pokedex_id: number;
    generation: number;
    name: {
        fr: string
    };
    sprites: {
        regular: string;
        shiny: string;
        gmax: string | null;
    };
    types: IPokemonType[];
    talents: { name: string; tc: boolean; }[];
    height: string;
    weight: string;
    catch_rate: number;
}

export type { IPokemon, IPokemonType };
