export interface IPokemonExtraData {
    abilities: { ability: { name: string; url: string }, is_hidden: boolean; slot: number }[];
    cries: {
        latest: URL;
        legacy: URL;
    };
    foo:string;
}
