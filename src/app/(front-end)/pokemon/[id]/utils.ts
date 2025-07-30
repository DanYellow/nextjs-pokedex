import { IStatComputed } from "@/app/_types/Pokeapi";
import { statistics } from "@/app/_utils";

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
