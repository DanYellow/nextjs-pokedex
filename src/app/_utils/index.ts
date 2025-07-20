export const versionForName: { [key: string]: string; } = {
    red: "Pokémon Rouge",
    blue: "Pokémon Bleue",
    yellow: "Pokémon Jaune",
    gold: "Pokémon Or",
    silver: "Pokémon Argent",
    crystal: "Pokémon Crystal",
    sapphire: "Pokémon Saphir",
    ruby: "Pokémon Rubis",
    emerald: "Pokémon Émeraude",
    firered: "Pokémon Rouge feu",
    leafgreen: "Pokémon Vert feuille",
    diamond: "Pokémon Diamant",
    pearl: "Pokémon Perle",
    platinum: "Pokémon Platine",
    heartgold: "Pokémon Or HeartGold",
    soulsilver: "Pokémon Argent SoulSilver",
    white: "Pokémon Blanche",
    black: "Pokémon Noire",
    "black-2": "Pokémon Noire 2",
    "white-2": "Pokémon Blanche 2",
    x: "Pokémon X",
    y: "Pokémon Y",
    "omega-ruby": "Pokémon Rubis Oméga",
    "ultra-sun": "Pokémon Ultra-Soleil",
    sun: "Pokémon Soleil",
    moon: "Pokémon Lune",
    "ultra-moon": "Pokémon Ultra-Lune",
    "alpha-sapphire": "Pokémon Saphir Alpha",
    sword: "Pokémon Épée",
    shield: "Pokémon Bouclier",
    violet: "Pokémon Violet",
    scarlet: "Pokémon Écarlate",
    "lets-go-eevee": "Pokémon Let's Go, Évoli",
    "lets-go-pikachu": "Pokémon Let's Go, Pikachu",
    "legends-arceus": "Légendes Pokémon : Arceus",
};

export const cleanString = (string: string) =>
    string
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");


export const isElementInViewport = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();

    return (
        rect.top >= -1 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

export const capitalizeFirstLetter = (val: string) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
};

export const typesEnglish: { [key: string]: string; } = {
    "plante": "grass",
    "insecte": "bug",
    "tenebres": "dark",
    "electrik": "electric",
    "fee": "fairy",
    "combat": "fighting",
    "spectre": "ghost",
    "sol": "ground",
    "normal": "normal",
    "glace": "ice",
    "poison": "poison",
    "roche": "rock",
    "eau": "water",
    "acier": "steel",
    "psy": "psychic",
    "feu": "fire",
    "vol": "flying",
    "dragon": "dragon",
}

// export const debounce = (callback: Function, wait: number) => {
//     let timeoutId = null;
//     return (...args) => {
//         window.clearTimeout(timeoutId);
//         timeoutId = window.setTimeout(() => {
//             callback(...args);
//         }, wait);
//     };
// };

export const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
};

export const onTransitionsEnded = (node: Element) => {
    return Promise.allSettled(
        node.getAnimations().map(animation => animation.finished)
    );
}

export * from "./colors";
export * from "./pokemon-modal.utils";
export * from "./formsDictionary";
export * from "./constants";
