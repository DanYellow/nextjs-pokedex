
export interface IPokemonType {
    name: string;
    image: string;
}

export interface IPokemonAbilityComplete {
    name: { fr: string };
    tc: boolean;
    description: boolean;
}

export interface IPokemonCore {
    pokedex_id: number;
    name: {
        fr: string
    };
    sprites: {
        regular: string;
        shiny: string;
        gmax: string | null;
    };
    types: IPokemonType[];
}

export interface IPokemon extends IPokemonCore {
    generation: number;
    talents: { name: string; tc: boolean; }[];
    height: string;
    weight: string;
    catch_rate: number;
    sexe: { male: number; female: number; } | null
}

export interface IPokemonError {
    status: number;
    message: string;
}
