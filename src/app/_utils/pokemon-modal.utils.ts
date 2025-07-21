import {
    cleanString,
    typesTextColorGroupHocus,
    typesBorderColor,
} from "@/app/_utils/index"

// import loadingImageRaw from "/images/loading.svg?raw";

// export const createAlternateForm = (template, data, event) => {
//     const url = new URL(location.origin);
//     url.searchParams.set("id", data.pokedex_id);
//     const imgTag = template.querySelector("img");
//     replaceImage(imgTag, data.sprite);
//     imgTag.alt = `sprite de ${data.name.fr} forme ${data.region}`;
//     imgTag.fetchPriority = "low";
//     template.querySelector("[data-pkmn-name]").textContent = `${data.name.fr}`;

//     const aTag = template.querySelector("[data-pokemon-data]");
//     const alternateForm = data.varieties
//         ?.filter((_item) => !_item.is_default)
//         .find((_item) => {
//             return _item.pokemon?.name.includes(data.region);
//         });

//     if (alternateForm) {
//         data.alternate_form_id = alternateForm?.pokemon.url
//             ?.split("/")
//             .filter(Boolean)
//             .at(-1);
//         url.searchParams.set("region", data.region);
//         url.searchParams.set(
//             "alternate_form_id",
//             data.alternate_form_id
//         );
//     }

//     aTag.href = url;
//     aTag.dataset.pokemonData = JSON.stringify(data);
//     aTag.addEventListener("click", (e) => event(e, data.region));

//     return template;
// }


type IAbility = {
    name: string;
    id: number;
    names: {
        language: { name: string }
        name: string;
    }[];
    flavor_text_entries: {
        flavor_text: string;
        language: {
            name: string;
        }
    }[];
}

export const getAbilityForLang = (ability: IAbility, lang = "fr") => {
    const name = ability.names.filter((item) => item.language.name === lang)[0].name;
    const description = ability.flavor_text_entries.filter((item) => item.language.name === lang).at(-1)?.flavor_text || "Définition non trouvée";

    return { name: { fr: name, en: ability.name }, description, id: ability.id };
}

export const getExternalDataForLang = (externalData, lang = "fr") => {
    return {
        ...externalData,
        flavor_text_entries: externalData.flavor_text_entries.filter((item) => item.language.name === lang),
    };
}
