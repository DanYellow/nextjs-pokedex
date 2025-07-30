import { fetchPokemon, fetchPokemonDetails } from "@/app/_api";
import { IPokemon, IPokemonError, IPokemonType } from "@/app/_types/Pokemon";
import Image from "next/image";
import React, { cache } from "react";

import Modal from "@/app/(front-end)/pokemon/[id]/region/[name]/modal";
import PokemonPage from "@/app/(front-end)/pokemon/[id]/page";
import { cleanString, NB_NUMBER_INTEGERS_PKMN_ID } from "@/app/_utils";
import { Metadata } from "next";
import { IPokemonExtraData } from "@/app/_types/Pokeapi";
import { formatStatistics } from "../../utils";

type PageProps = {
    params: Promise<{ id: string, name: string }>;
    searchParams?: { [key: string]: string | string[] | undefined };
}

const getPkmn = cache(async (id: number | string, region: string | null = null) => {
    const res = await fetchPokemon(id, region)
    return res
})

export async function generateMetadata(
    { params }: PageProps
): Promise<Metadata> {
    const { id, name } = await params;

    let pkmn = await getPkmn(id, name);

    if (pkmn === null || (pkmn as IPokemonError).status) {
        return {
            title: "Erreur",
        }
    }

    pkmn = (pkmn as IPokemon);

    return {
        title: `#${String(pkmn.pokedex_id).padStart(NB_NUMBER_INTEGERS_PKMN_ID, '0')} ${pkmn.name.fr}`,
        icons: {
            icon: [{ rel: "icon", url: pkmn.sprites.regular }]
        },
        openGraph: {
            title: `#${String(pkmn.pokedex_id).padStart(NB_NUMBER_INTEGERS_PKMN_ID, '0')} ${pkmn.name.fr}`,
            images: [pkmn.sprites.regular]
        },
    }
}

async function RegionPage({
    params,
    searchParams
}: PageProps) {
    const { id, name } = await params;
    const { id: queryId } = await searchParams;

    let pkmn = await getPkmn(id, name);

    if (pkmn === null || (pkmn as IPokemonError).status) {
        return {
            title: "Erreur",
        }
    }

    pkmn = (pkmn as IPokemon);
    const pkmnExtraData = await fetchPokemonDetails(Number(queryId)) as IPokemonExtraData;

    const listPokemonTypes = pkmn.types.map((item: { name: string }) => item.name);

    const { listStatistics, totalBaseStat } = formatStatistics((pkmnExtraData as IPokemonExtraData).stats);

    return (
        <>
            <PokemonPage params={params} />
            <Modal>
                <div
                    style={{
                        borderImage: `linear-gradient(to right, var(--type-${cleanString(listPokemonTypes[0])}) 0%, var(--type-${cleanString(listPokemonTypes[0])}) 50%, var(--type-${cleanString(listPokemonTypes?.[1] || listPokemonTypes[0])}) 50%, var(--type-${cleanString(listPokemonTypes?.[1] || listPokemonTypes[0])}) 100%) 1`
                    }}
                    className="bg-gray-50 pt-2 pb-3 border-black border-solid border-b">

                    <div className="flex flex-col sm:flex-row gap-3 relative sm:items-center">
                        <div className="w-20">
                            <Image
                                src={pkmn.sprites.regular}
                                alt={`sprite de ${pkmn.name.fr}`}
                                width={175}
                                height={38}
                                priority
                            />
                        </div>
                        <div className="grow">
                            <h1 className="text-2xl font-bold">
                                #{String(pkmn.pokedex_id).padStart(NB_NUMBER_INTEGERS_PKMN_ID, '0')} {pkmn.name.fr}
                                {/* {(pkmnSpecies.is_legendary || pkmnSpecies.is_mythical) && (
                                    <span className={`py-0.5 ml-1.5 px-1.5 whitespace-nowrap text-black rounded-md text-xs align-super font-normal ${pkmnSpecies.is_legendary ? "bg-amber-400" : "bg-slate-400"}`}>
                                        {pkmnSpecies.is_legendary ? "Pokémon Légendaire" : "Pokémon Fabuleux"}
                                    </span>
                                )} */}
                            </h1>
                            <p className="text-sm -mt-2"><span className="inline-flex size-4 border mr-0.5 aspect-square border-black rounded-full overflow-hidden"><span className="fi fi-gb fis"></span></span> {pkmn.name.en} | <span className="inline-flex size-4 border aspect-square border-black rounded-full overflow-hidden mr-0.5"><span className="fi fi-jp fis"></span></span> {pkmn.name.jp}</p>

                            <p className="text-sm mt-1">{pkmn.category}</p>
                            <div className="@container">
                                <ul className="flex gap-1 flex-col @[10rem]:flex-row">
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
                <details className="mb-3">
                    <summary className="hover:marker:text-[color:var(--dot-type-1-color)] font-bold text-xl">Statistiques de base</summary>
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
                        <p className="mt-8 px-3 py-2 h-full font-bold rounded-tl-lg border-t-2 border-t-solid border-black" aria-label="Total statistique de Hypnomade : 483">Total</p>
                        <p className="mt-8 px-3 py-2 h-full rounded-tr-lg sm:col-span-2 border-t-2 border-black" aria-hidden="true">{totalBaseStat}</p>
                    </div>
                </details>
            </Modal>
        </>
    )
}

export default RegionPage;
