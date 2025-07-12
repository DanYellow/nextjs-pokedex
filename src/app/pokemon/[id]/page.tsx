import Image from "next/image";

import { Metadata, ResolvingMetadata } from "next";
import type { Viewport } from 'next';

import { cache } from 'react'

import type { IPokemonAbilityComplete, IPokemonType, IPokemon, IPokemonError } from "@/app/_types/Pokemon";

import { fetchPokemon, fetchPokemonForGeneration } from "@/app/_api/tyradex";
import { fetchPokemonDetails, fetchAbilityData } from "@/app/_api/pokeapi";
import { cleanString, typesAnimatedBorderColor, getAbilityForLang } from "@/app/_utils/index";


import PokemonSibling from "@/app/_components/PokemonSibling";

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
        title: `#${String(id).padStart(4, '0')} ${pkmn.name.fr}`,
        icons: {
            icon: [{ rel: "icon", url: pkmn.sprites.regular }]
        },
        openGraph: {
            title: `#${String(id).padStart(4, '0')} ${pkmn.name.fr}`,
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
            <p>{(pkmn as IPokemonError).message}</p>
        )
    }

    pkmn = (pkmn as IPokemon);

    const { data: pokedex } = await fetchPokemonForGeneration(pkmn.generation);

    const pkmnExtraData = await fetchPokemonDetails(Number(id));

    const listTypes = pkmn.types.map((item: { name: string }) => item.name)

    const listAbilitiesDescriptions: { name: { fr: string; } }[] = [];
    for (const ability of (pkmnExtraData?.abilities || [])) {
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

    const prevPokemon = pokedex.find((item: IPokemon) => item?.pokedex_id === (pkmn as IPokemon).pokedex_id - 1) || {};
    let nextPokemon = pokedex.find((item: IPokemon) => item?.pokedex_id === (pkmn as IPokemon).pokedex_id + 1) || null;

    return (
        <>
            <div className="max-w-6xl mx-auto px-4">
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
                                <h1 className="text-2xl font-bold">#{String(id).padStart(4, '0')} {pkmn.name.fr}</h1>
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
                        <ul className="shrink-0 bg-slate-50 rounded-md px-2 py-3">
                            <li><span className="font-bold">Masse : </span>{pkmn.weight}</li>
                            <li><span className="font-bold">Taille : </span>{pkmn.height}</li>
                            <li><span className="font-bold">Taux de capture : </span>{pkmn.catch_rate}</li>
                        </ul>
                        <div className="grow bg-slate-50 rounded-md px-2 py-3">
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

                <nav className="text-black">
                    <ul className="my-3 py-3 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-6 justify-center" data-list-siblings-pokemon>
                        {
                            [prevPokemon, pkmn, nextPokemon].filter(Boolean).map((item: IPokemon) => {
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
