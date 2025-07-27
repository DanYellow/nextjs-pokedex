
export interface IPokemonType {
    readonly name: string;
    readonly image: string;
}

export interface IPokemonAbilityComplete {
    name: { fr: string };
    tc: boolean;
    description: boolean;
}

export interface IPokemonCore {
    readonly pokedex_id: number;
    readonly name: {
        fr: string
    };
    readonly sprites: {
        regular: string;
        shiny: string;
        gmax: string | null;
    };
    readonly types: IPokemonType[];
}

export interface IEvolution {
    pokedex_id: number;
    name: string;
    condition: string;
}

export interface IPokemon extends IPokemonCore {
    readonly generation: number;
    readonly category: string;
    readonly talents: { name: string; tc: boolean; }[];
    readonly height: string;
    readonly weight: string;
    readonly catch_rate: number;
    readonly sexe: { male: number; female: number; } | null;
    readonly resistances: { name: string; multiplier: number; }[]
    readonly evolution: {
        readonly pre: IEvolution[] | null;
        readonly next: IEvolution[] | null;
    }
}

export interface IPokemonError {
    status: number;
    message: string;
}

export interface IType {
    readonly name: { [key: string]: string; };
    readonly sprites: string;
}

//  type EffectivenessNameType = Record<'clean' | 'raw', string>


// type EffectivenessNameType = 'clean' | 'raw';
export interface IEffectiveness {
    name: { [key: string]: Record<'clean' | 'raw', string>; } // [key in EffectivenessNameType]: string }
    multiplier: number;
    is_effective: boolean;
}
