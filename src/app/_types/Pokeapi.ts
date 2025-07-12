export interface IPokemonExtraData {
    abilities: { ability: { name: string; url: string }, is_hidden: boolean; slot: number }[];
    cries: {
        latest: URL;
        legacy: URL;
    };
    stats: { base_stat: number; effort: number; stat: { name: string} }[]
}


// type RGB = `rgb(${number}, ${number}, ${number})`;
// type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
// type RGBA = `rgba(from ${number}, ${number}, ${number}, ${number})`;
// type HEX = `#${string}`;

// type Color = RGB | RGBA | HEX;

// style="border-top: 2px solid black; margin-top: 1.75rem; border-left-width: 0px;"
// style="border-top: 2px solid black; margin-top: 1.75rem; border-right-width: 0px;"

export interface IStatComputed {
    color: string;
    transparentColor: string;
    name: string;
    ariaLabel: string;
    value: number;
}
