import Image from "next/image";
import { Metadata, ResolvingMetadata } from "next";
import { cache } from 'react'

import type { IPokemonAbilityComplete, IPokemonType, IPokemon } from "@/app/_types/Pokemon";

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
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = (await params).id

    const pkmn = await getPkmn(Number(id))

    if (pkmn === null || pkmn.status) {
        return {
            title: "Erreur",
        }
    }

    return {
        title: `#${String(id).padStart(4, '0')} ${pkmn.name.fr}`,
        icons: {
            icon: pkmn.sprites.regular,
        },
        openGraph: {
            title: `#${String(id).padStart(4, '0')} ${pkmn.name.fr}`,
            images: [pkmn.sprites.regular]
        },
        // description: post.description,
    }
}


export default async function BlogPostPage({
    params,
}: Props) {
    const { id } = await params;
    const pkmn = await getPkmn(Number(id));

    if (pkmn.status) {
        return (
            <p>{pkmn.message}</p>
        )
    }

    const { data: pokedex, hasReachedEnd } = await fetchPokemonForGeneration();

    const pkmnExtraData = await fetchPokemonDetails(Number(id));

    const listTypes = pkmn.types.map((item: { name: string }) => item.name)

    const listAbilitiesDescriptions: object[] = [];
    for (const ability of (pkmnExtraData?.abilities || [])) {
        const abilityData = await fetchAbilityData(ability.ability.url);
        listAbilitiesDescriptions.push(getAbilityForLang(abilityData));
    };

    const listKnownAbilities: string[] = listAbilitiesDescriptions.map((item) => cleanString(item.name.fr.toLowerCase().replace("-", "")));

    // const listTalents = (pkmn?.talents || [])
    //     .filter((item) => listKnownAbilities.includes(cleanString(item.name.toLowerCase().replace("-", ""))))
    //     .map((item) => {
    //         const description = listAbilitiesDescriptions.find((desc) => cleanString(desc.name.fr.toLowerCase().replace("-", "")) === cleanString(item.name.toLowerCase().replace("-", "")));
    //         return {
    //             ...item,
    //             ...description
    //         }
    //     }) as unknown as IPokemonAbilityComplete[];

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
            {/* <style jsx>{`
      p {
        color: red;
      }
    `}</style> */}
            <div className="max-w-6xl mx-auto ">
                <header className="main-infos border-b text-black pb-4 mb-3 md:sticky landscape:static landscape:lg:sticky top-0">
                    <div
                        style={{
                            borderImage: `linear-gradient(to right, var(--type-${cleanString(listTypes[0])}) 0%, var(--type-${cleanString(listTypes[0])}) 50%, var(--type-${cleanString(listTypes?.[1] || listTypes[0])}) 50%, var(--type-${cleanString(listTypes?.[1] || listTypes[0])}) 100%) 1`
                        }}
                        className="sticky-header relative px-4 bg-white top-0 pt-2 pb-3 border-black border-solid border-b">

                        <div className="flex flex-row gap-3 relative">
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
                                <h1 className="text-3xl font-bold">#{String(id).padStart(4, '0')} {pkmn.name.fr}</h1>
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
                    <div className="flex flex-col md:flex-row gap-3 mt-2 items-stretch md:items-start px-4">
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
                    <ul className="my-3 px-4 py-3 grid grid-cols-[1fr_1fr] sm:grid-cols-[1fr_auto_1fr] gap-6 justify-center" data-list-siblings-pokemon>
                        {
                            [prevPokemon, pkmn, nextPokemon].filter(Boolean).map((item: IPokemon) => {
                                const isCurrentPkmn = item.pokedex_id === (pkmn as IPokemon).pokedex_id;
                                const isPreviousPkmn = item.pokedex_id < (pkmn as IPokemon).pokedex_id
                                const listClasses = [
                                    "group",
                                    ...[isCurrentPkmn ? ["shrink-0", "hidden", "sm:[display:revert]", "basis-0", "font-bold", "text-center"] : ""],
                                    ...[!isCurrentPkmn ? ["grow"] : ""],
                                ].flat()

                                return (
                                    <li
                                        className={listClasses.join(" ")}
                                    >
                                        <PokemonSibling
                                            key={item.pokedex_id}
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
