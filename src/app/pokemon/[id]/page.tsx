import Image from "next/image";
import { Metadata, ResolvingMetadata } from "next";
import { cache } from 'react'


import type { IPokemon, IPokemonType } from "@/app/_types/Pokemon";
import { fetchPokemon } from "@/app/_api/tyradex";
import { fetchPokemonDetails, fetchAbilityData } from "@/app/_api/pokeapi";
import { cleanString, typesAnimatedBorderColor, getAbilityForLang } from "@/app/_utils/index";


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

    return {
        title: `#${String(id).padStart(4, '0')} ${pkmn.name.fr}`,
        // description: post.description,
    }
}


export default async function BlogPostPage({
    params,
}: Props) {
    const { id } = await params;
    const pkmn = await getPkmn(Number(id));
    const pkmnExtraData = await fetchPokemonDetails(Number(id));

    const listTypes = pkmn.types.map((item: { name: string }) => item.name)

    const listAbilitiesDescriptions: object[] = [];
    for (const ability of (pkmnExtraData?.abilities || [])) {
        const abilityData = await fetchAbilityData(ability.ability.url);
        listAbilitiesDescriptions.push(getAbilityForLang(abilityData));
    };

    const listKnownAbilities = listAbilitiesDescriptions.map((item) => cleanString(item.name.fr.toLowerCase().replace("-", "")));

    const listTalents = (pkmn?.talents || [])
        .filter((item) => listKnownAbilities.includes(cleanString(item.name.toLowerCase().replace("-", ""))))
        .map((item) => ({
            ...item,
            ...listAbilitiesDescriptions.find((description) => cleanString(description.name.fr.toLowerCase().replace("-", "")) === cleanString(item.name.toLowerCase().replace("-", "")))
        }));

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
                            {/* <button
                                type="button"
                                className="rounded-sm absolute px-1.5 bg-white right-0 top-0 hocus:text-(color:--bg-modal-color) toggle-pip-btn grid overflow-x-clip whitespace-nowrap group-picture-in-picture:hidden"
                                data-toggle-picture-in-picture
                            >
                                <svg fill="none" style={{ scale: 0.75, translate: "10% 0", }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 6.25C2 4.45507 3.45507 3 5.25 3H18.75C20.5449 3 22 4.45507 22 6.25V12H20.5V6.25C20.5 5.2835 19.7165 4.5 18.75 4.5H5.25C4.2835 4.5 3.5 5.2835 3.5 6.25V15.75C3.5 16.7165 4.2835 17.5 5.25 17.5H11V19H5.25C3.45507 19 2 17.5449 2 15.75V6.25ZM14 13C12.8954 13 12 13.8954 12 15V20C12 21.1046 12.8954 22 14 22H21C22.1046 22 23 21.1046 23 20V15C23 13.8954 22.1046 13 21 13H14ZM5.21967 6.21967C5.51256 5.92678 5.98744 5.92678 6.28033 6.21967L9.5 9.43934V7.75C9.5 7.33579 9.83579 7 10.25 7C10.6642 7 11 7.33579 11 7.75V11.25C11 11.6642 10.6642 12 10.25 12H6.75C6.33579 12 6 11.6642 6 11.25C6 10.8358 6.33579 10.5 6.75 10.5H8.43934L5.21967 7.28033C4.92678 6.98744 4.92678 6.51256 5.21967 6.21967Z" fill="currentColor"></path>
                                </svg>
                                <p className="text-black content-center ml-1.5">Ouvrir dans une fenêtre</p>
                            </button> */}
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
                                            {item.name.fr}
                                            {item.tc ? (<span className="py-0.5 px-1.5 whitespace-nowrap bg-slate-900 text-white rounded-md text-xs align-super font-normal">Talent caché</span>) : null}
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
            </div>
        </>
    )
}
