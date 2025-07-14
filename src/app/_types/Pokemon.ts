
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
    category: string;
    talents: { name: string; tc: boolean; }[];
    height: string;
    weight: string;
    catch_rate: number;
    sexe: { male: number; female: number; } | null;
    resistances: { name: string; multiplier: number; }[]
}

export interface IPokemonError {
    status: number;
    message: string;
}

export interface IType {
    name: { [key: string]: string; };
    sprites: string;
}

//  type EffectivenessNameType = Record<'clean' | 'raw', string>


// type EffectivenessNameType = 'clean' | 'raw';
export interface IEffectiveness {
    name: { [key: string]: Record<'clean' | 'raw', string>; } // [key in EffectivenessNameType]: string }
    multiplier: number;
    is_effective: boolean;
}
