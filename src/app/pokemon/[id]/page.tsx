import Image from "next/image";

import { Metadata, ResolvingMetadata } from "next";
import type { Viewport } from 'next';

import React, { cache } from 'react';

import type { IPokemonAbilityComplete, IPokemonType, IPokemon, IPokemonError } from "@/app/_types/Pokemon";
import type { IStatComputed } from "@/app/_types/Pokeapi";

import { fetchPokemon, fetchPokemonForGeneration } from "@/app/_api/tyradex";
import { fetchPokemonDetails, fetchAbilityData } from "@/app/_api/pokeapi";
import { cleanString, NB_NUMBER_INTEGERS_PKMN_ID, getAbilityForLang, statistics } from "@/app/_utils/index";


import PokemonSibling from "@/app/_components/PokemonSibling";
import { IPokemonExtraData } from "@/app/_types/Pokeapi";
import Link from "next/link";
import PokemonBodyStyle from "@/app/_components/PokemonBodyStyle";

type Props = {
    params: Promise<{ id: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const getPkmn = cache(async (id: Number) => {
    const res = await fetchPokemon(Number(id))
    return res
})

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = (await params).id

    let pkmn = await getPkmn(Number(id))

    if (pkmn === null || (pkmn as IPokemonError).status) {
        return {
            title: "Erreur",
        }
    }

    pkmn = (pkmn as IPokemon);

    return {
        title: `#${String(id).padStart(NB_NUMBER_INTEGERS_PKMN_ID, '0')} ${pkmn.name.fr}`,
        icons: {
            icon: [{ rel: "icon", url: pkmn.sprites.regular }]
        },
        openGraph: {
            title: `#${String(id).padStart(NB_NUMBER_INTEGERS_PKMN_ID, '0')} ${pkmn.name.fr}`,
            images: [pkmn.sprites.regular]
        },
        // description: post.description,
    }
}

export async function generateViewport({ params }: Props): Promise<Viewport> {
    const id = (await params).id

    let pkmn = await getPkmn(Number(id))

    if (pkmn === null || (pkmn as IPokemonError).status) {
        return {
            themeColor: 'black',
        }
    }

    return {
        themeColor: 'black',
    }
}


export default async function BlogPostPage({
    params,
}: Props) {
    const { id } = await params;
    let pkmn = await getPkmn(Number(id));

    if ((pkmn as IPokemonError).status) {
        return (
            <>
                <header className="py-2 px-4 bg-slate-900 text-white sticky left-0 right-0 top-0 z-50 ">
                    <div className="max-w-6xl flex justify-between mx-auto px-4">
                        <div>
                            <h2 className="text-2xl">
                                Erreur
                            </h2>
                        </div>
                        <Link className="underline hocus:no-underline self-end" href="/?id=1">
                            Retourner au Pokédex
                        </Link>
                    </div>
                </header>
                <div className="max-w-6xl mx-auto px-4 min-h-screen pt-4"
                    style={{ borderLeft: "1px solid black", borderRight: "1px solid black" }}
                >
                    <p className="text-2xl font-bold">{(pkmn as IPokemonError).message}</p>
                </div>
            </>
        )
    }

    pkmn = (pkmn as IPokemon);

    const { data: pokedex } = await fetchPokemonForGeneration(pkmn.generation);

    const pkmnExtraData = await fetchPokemonDetails(Number(id));

    let prevPokemon = (pokedex as IPokemon[]).find((item: IPokemon) => item?.pokedex_id === (pkmn as IPokemon).pokedex_id - 1) || {};
    let nextPokemon = (pokedex as IPokemon[]).find((item: IPokemon) => item?.pokedex_id === (pkmn as IPokemon).pokedex_id + 1) || null;

    const firstPokemonGenerationId = (pokedex as IPokemon[])[0].pokedex_id

    const lastPokemonGenerationId = ((pokedex as IPokemon[]).at(-1) as IPokemon).pokedex_id;

    if (lastPokemonGenerationId === pkmn.pokedex_id) {
        nextPokemon = await getPkmn(Number(pkmn.pokedex_id + 1)) as IPokemon;
    } else if (firstPokemonGenerationId === pkmn.pokedex_id && pkmn.generation > 1) {
        prevPokemon = await getPkmn(Number(pkmn.pokedex_id - 1)) as IPokemon;
    }

    const listTypes = pkmn.types.map((item: { name: string }) => item.name)

    const listAbilitiesDescriptions: { name: { fr: string; } }[] = [];
    for (const ability of ((pkmnExtraData as IPokemonExtraData)?.abilities || [])) {
        const abilityData = await fetchAbilityData(ability.ability.url);
        listAbilitiesDescriptions.push(getAbilityForLang(abilityData));
    };

    const listKnownAbilities: string[] = listAbilitiesDescriptions.map((item) => cleanString(item.name.fr.toLowerCase().replace("-", "")));

    const listTalents = (pkmn?.talents || [])
        .filter((item) => listKnownAbilities.includes(cleanString(item.name.toLowerCase().replace("-", ""))))
        .map((item) => ({
            ...item,
            ...listAbilitiesDescriptions.find((description) => cleanString(description.name.fr.toLowerCase().replace("-", "")) === cleanString(item.name.toLowerCase().replace("-", "")))
        })) as unknown as IPokemonAbilityComplete[];

    const listStatistics: IStatComputed[] = [];
    const alpha: number = 0.45;
    let totalBaseStat = 0;

    (pkmnExtraData as IPokemonExtraData).stats.forEach((item) => {
        listStatistics.push({
            transparentColor: `rgb(from ${statistics[item.stat.name].color} r g b / ${alpha})`,
            color: statistics[item.stat.name].color,
            name: statistics[item.stat.name].name,
            value: item.base_stat,
            ariaLabel: `${statistics[item.stat.name].name} de base ${item.base_stat}`,
        })
        totalBaseStat += item.base_stat;
    })

    return (
        <>
            <PokemonBodyStyle types={listTypes} />
            <header className="py-2 px-4 bg-slate-900 text-white sticky left-0 right-0 top-0 z-50 ">
                <div className="max-w-6xl flex justify-between mx-auto px-4 flex-col sm:flex-row landscape:!flex-row gap-y-5">
                    <div>
                        <h2 className="text-2xl">
                            Génération #{pkmn.generation}
                        </h2>
                        <p className="py-0.5 px-2 rounded-md bg-slate-600 text-white inline-flex">
                            <span>{String(firstPokemonGenerationId).padStart(NB_NUMBER_INTEGERS_PKMN_ID, '0')} ➜ {String(lastPokemonGenerationId).padStart(NB_NUMBER_INTEGERS_PKMN_ID, '0')}</span>
                        </p>
                    </div>
                    <Link className="underline hocus:no-underline sm:self-end" href={`/?id=${pkmn.generation}#pkmn-${pkmn.pokedex_id}`}>
                        Retourner au Pokédex
                    </Link>
                </div>
            </header>
            <div className="max-w-6xl mx-auto px-4 min-h-screen bg-gray-50"
                style={{ borderLeft: `1px solid var(--type-${cleanString(listTypes[0])})`, borderRight: `1px solid var(--type-${cleanString(listTypes?.[1] || listTypes[0])})` }}
            >
                <header className="main-infos border-b text-black pb-4 mb-3 md:sticky landscape:static landscape:lg:sticky top-0">
                    <div
                        style={{
                            borderImage: `linear-gradient(to right, var(--type-${cleanString(listTypes[0])}) 0%, var(--type-${cleanString(listTypes[0])}) 50%, var(--type-${cleanString(listTypes?.[1] || listTypes[0])}) 50%, var(--type-${cleanString(listTypes?.[1] || listTypes[0])}) 100%) 1`
                        }}
                        className="sticky-header relative px-4 bg-gray-50 top-0 pt-2 pb-3 border-black border-solid border-b">

                        <div className="flex flex-row gap-3 relative items-center">
                            <div className="w-20">
                                <Image
                                    className="@xs:max-w-20 group-[.selected]:scale-85 group-hocus:scale-85 transition-transform"
                                    src={pkmn.sprites.regular}
                                    alt={`sprite de ${pkmn.name.fr}`}
                                    width={175}
                                    height={38}
                                    priority
                                />
                            </div>
                            <div className="grow">
                                <h1 className="text-2xl font-bold">#{String(id).padStart(NB_NUMBER_INTEGERS_PKMN_ID, '0')} {pkmn.name.fr}</h1>
                                <p className="text-sm -mt-1">{pkmn.category}</p>
                                <div className="@container">
                                    <ul className="flex gap-2 mt-2 flex-col @[10rem]:flex-row">
                                        {pkmn.types.map(({ name, image }: IPokemonType) => (
                                            <li
                                                key={name}
                                                className="py-0.5 px-2 rounded-md gap-1 flex items-center type-name w-fit"
                                                aria-label="Type ${idx + 1} ${type.name}"
                                                style={{
                                                    backgroundColor: `var(--type-${cleanString(name)})`
                                                }}
                                            >
                                                <img className="h-5" src={image} alt={`icône type ${name}`} />
                                                {name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row w-full overflow-hidden mt-2 min-h-9">
                        {pkmn.sexe === null || pkmn.sexe.male === 0 ? null : (
                            <div className="bar-sex-male only:rounded-md relative bg-sky-300 border-b-sky-700 border-b-4 border-solid px-2 py-1 rounded-l-md after:bg-sky-700 overflow-hidden" style={{ width: `${pkmn.sexe.male}%` }}>
                                <div className="hidden md:block text-black">
                                    <p className="whitespace-nowrap" id="sex-male">Mâle ♂</p>
                                    <p className="text-xs" aria-labelledby="sex-male">{pkmn.sexe.male}%</p>
                                </div>
                            </div>
                        )}

                        {pkmn.sexe === null || pkmn.sexe.female === 0 ? null : (
                            <div className="bar-sex-female only:rounded-md relative bg-pink-300 border-b-pink-700 border-b-4 border-solid px-2 py-1 rounded-r-md after:bg-pink-700 overflow-hidden" style={{ width: `${pkmn.sexe.female}%` }}>
                                <div className="hidden md:block text-black">
                                    <p className="whitespace-nowrap" id="sex-female">Femelle ♀</p>
                                    <p className="text-xs" aria-labelledby="sex-female">{pkmn.sexe.female}%</p>
                                </div>
                            </div>
                        )}

                        {(pkmn.sexe === null) ? (
                            <div
                                className="bg-slate-300 border-b-slate-700 border-b-4 border-solid px-2 py-1 w-full rounded-md h-14"
                            >
                                <p>Asexué</p>
                            </div>
                        ) : null}

                    </div>
                    <div className="md:hidden grid grid-flow-col">
                        {pkmn.sexe === null || pkmn.sexe.male === 0 ? null : (
                            <div>
                                <p className="whitespace-nowrap">Mâle ♂</p>
                                <p className="text-xs">{pkmn.sexe.male}%</p>
                            </div>
                        )}
                        {pkmn.sexe === null || pkmn.sexe.female === 0 ? null : (
                            <div className="text-right">
                                <p className="whitespace-nowrap">Femelle ♀</p>
                                <p className="text-xs">{pkmn.sexe.female}%</p>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col md:flex-row gap-3 mt-2 items-stretch md:items-start">
                        <ul className="shrink-0 bg-slate-200 rounded-md px-2 py-3">
                            <li><span className="font-bold">Masse : </span>{pkmn.weight}</li>
                            <li><span className="font-bold">Taille : </span>{pkmn.height}</li>
                            <li><span className="font-bold">Taux de capture : </span>{pkmn.catch_rate}</li>
                        </ul>
                        <div className="grow bg-slate-200 rounded-md px-2 py-3 self-stretch">
                            <p className="font-bold">Talents</p>
                            <div className="flex flex-col gap-y-2">
                                {listTalents.map((item) => (
                                    <details key={item.name.fr} className="mb-1.5">
                                        <summary
                                            className="hover:marker:text-[color:--type-vol]"
                                        >
                                            <p className="inline-flex gap-1.5 items-start">
                                                {item.name.fr}
                                                {item.tc ? (<span className="py-0.5 px-1.5 whitespace-nowrap bg-slate-900 text-white rounded-md text-xs align-super font-normal">Talent caché</span>) : null}
                                            </p>
                                        </summary>
                                        <p className="ml-4">
                                            {item.description}
                                        </p>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </div>
                </header>

                <details>
                    <summary className="hover:marker:text-[color:--bg-modal-color] font-bold text-xl">Statistiques de base</summary>
                    <div className="grid gap-y-1.5 grid-cols-[1fr_max-content] sm:grid-cols-[max-content_max-content_1fr] grid-rows-[max-content] items-center pt-3 relative">
                        {listStatistics.map((item) => (
                            <React.Fragment key={item.name}>
                                <p className="px-3 py-2 h-full font-bold sm:top-0 sm:rounded-bl-lg rounded-tl-lg border-l-4 border-solid" style={{ backgroundColor: item.transparentColor, borderColor: item.transparentColor }} aria-label={item.ariaLabel}>{item.name}</p>
                                <p className="px-3 py-2 h-full border-r-4 sm:border-r-0 rounded-tr-lg text-right sm:rounded-tr-none" aria-hidden="true" style={{ backgroundColor: item.transparentColor, borderColor: item.transparentColor }}>{item.value}</p>
                                <div className="col-span-2 sm:col-auto px-3 py-2 h-full relative -top-[0.39rem] sm:top-0 sm:rounded-tr-lg sm:rounded-es-none rounded-ee-lg rounded-es-lg flex items-center sm:border-l-0 border-l-4 border-r-4 border-solid" style={{ backgroundColor: item.transparentColor, borderColor: item.transparentColor }}>
                                    <div className="stat-bar h-5 max-w-full border border-solid border-slate-900 relative" style={{ backgroundColor: item.color, width: `${item.value}px` }} />
                                </div>
                            </React.Fragment>
                        ))}
                        <p className="mt-8 px-3 py-2 h-full font-bold rounded-tl-lg border-t-2 border-t-solid border-black"  aria-label="Total statistique de Hypnomade : 483">Total</p>
                        <p className="mt-8 px-3 py-2 h-full rounded-tr-lg sm:col-span-2 border-t-2 border-black" aria-hidden="true">{totalBaseStat}</p>
                    </div>
                </details>

                <nav className="text-black">
                    <ul className="my-3 py-3 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-6 justify-center" data-list-siblings-pokemon>
                        {
                            ([prevPokemon, pkmn, nextPokemon].filter(Boolean) as IPokemon[]).map((item: IPokemon) => {
                                if (!Object.keys(item).length) {
                                    return (<li></li>)
                                }

                                const isCurrentPkmn = item.pokedex_id === (pkmn as IPokemon).pokedex_id;
                                const isPreviousPkmn = item.pokedex_id < (pkmn as IPokemon).pokedex_id
                                const listClasses = [
                                    "group",
                                    ...[isCurrentPkmn ? ["hidden", "sm:[display:revert]", "font-bold", "text-center"] : ""],
                                ].flat()

                                return (
                                    <li
                                        key={item.pokedex_id}
                                        className={listClasses.join(" ")}
                                    >
                                        <PokemonSibling
                                            isCurrentPkmn={isCurrentPkmn}
                                            isPreviousPkmn={isPreviousPkmn}
                                            name={item.name}
                                            pokedex_id={item.pokedex_id}
                                            sprites={item.sprites}
                                            types={item.types}
                                        />
                                    </li>
                                )
                            })
                        }
                    </ul>
                </nav>
            </div>
        </>
    )
}
