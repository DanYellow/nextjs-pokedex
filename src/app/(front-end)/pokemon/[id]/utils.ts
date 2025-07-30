import { IStatComputed } from "@/app/_types/Pokeapi";
import { IEffectiveness, IPokemon, IPokemonForm, IType } from "@/app/_types/Pokemon";
import { cleanString, statistics } from "@/app/_utils";
import { getPkmn } from "./page";

export const formatStatistics = (stats: { base_stat: number; effort: number; stat: { name: string } }[]) => {
    const listStatistics: IStatComputed[] = [];
    const alpha: number = 0.45;
    let totalBaseStat = 0;

    stats.forEach((item) => {
        listStatistics.push({
            transparentColor: `rgb(from ${statistics[item.stat.name].color} r g b / ${alpha})`,
            color: statistics[item.stat.name].color,
            name: statistics[item.stat.name].name,
            value: item.base_stat,
            ariaLabel: `${statistics[item.stat.name].name} de base ${item.base_stat}`,
        })
        totalBaseStat += item.base_stat;
    });

    return { listStatistics, totalBaseStat };
}

export const formatEffectiveness = (
    listResistances: { name: string; multiplier: number; }[],
    listTypes: IType[]
): IEffectiveness[] => {
    const effectiveDamageMultiplier = 2;
    const superEffectiveDamageMultiplier = 4;
    const listEffectiveness = listResistances.map((item) => {
        let type = listTypes.find(
            (type) => cleanString(type.name.fr) === cleanString(item.name)
        );

        if (type) {
            return {
                name: {
                    fr: {
                        clean: cleanString(item.name),
                        raw: item.name,
                    },
                    en: {
                        clean: cleanString(type.name.en),
                        raw: type.name.en,
                    },
                },
                multiplier: item.multiplier,
                is_effective: (item.multiplier === effectiveDamageMultiplier || item.multiplier === superEffectiveDamageMultiplier)
            };
        }
        return null;
    }).filter(Boolean) as unknown as IEffectiveness[];

    return listEffectiveness;
}

export const getRegionalForms = async (pokedex_id: number, listForms: IPokemonForm[]) => {
    const formsData = []
    for (const form of listForms) {
        const res = await getPkmn(Number(pokedex_id), form.region) as IPokemon;
        formsData.push({
            region: form.region,
            types: res.types,
            name: res.name.fr,
        })
    }

    return formsData;
}
