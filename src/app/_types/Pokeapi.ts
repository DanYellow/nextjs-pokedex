export interface IPokemonExtraData {
    abilities: { ability: { name: string; url: string }, is_hidden: boolean; slot: number }[];
    cries: {
        latest: string;
        legacy: string;
    };
    stats: { base_stat: number; effort: number; stat: { name: string } }[];
    sprites: { other: { home: { [key: string]: string } } };
    game_indices: { version: { name: string } }[];
}

export interface IPokemonSpecies {
    is_legendary: boolean;
    is_mythical: boolean;
    names: { language: { name: string; url: string; }; name: string; }[];
    flavor_text_entries: { language: { name: string; url: string; }; flavor_text: string; version: { name: string; } }[];
    pokedex_numbers: { entry_number: number; pokedex: { name: string; } }[];
    varieties: { is_default: boolean; pokemon: { name: string; url: string } }[];
}

// type RGB = `rgb(${number}, ${number}, ${number})`;
// type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
// type RGBA = `rgba(from ${number}, ${number}, ${number}, ${number})`;
// type HEX = `#${string}`;

// type Color = RGB | RGBA | HEX;

export interface IStatComputed {
    color: string;
    transparentColor: string;
    name: string;
    ariaLabel: string;
    value: number;
}
