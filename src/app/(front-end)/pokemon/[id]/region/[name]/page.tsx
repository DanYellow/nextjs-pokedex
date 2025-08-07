import { fetchAbilityData, fetchAllTypes, fetchPokemon, fetchPokemonDetails, fetchPokemonExternalData } from "@/app/_api";
import { IPokemon, IPokemonAbilityComplete, IPokemonError, IPokemonType, IType } from "@/app/_types/Pokemon";
import Image from "next/image";
import React, { cache, ReactNode } from "react";

import ModalWrapper from "@/app/(front-end)/pokemon/[id]/region/[name]/modal-wrapper";
import PokemonPage from "@/app/(front-end)/pokemon/[id]/page";
import { cleanString, getAbilityForLang, getPkmnIdFromURL, NB_NUMBER_INTEGERS_PKMN_ID } from "@/app/_utils";
import { Metadata } from "next";
import { IPokemonExtraData, IPokemonSpecies } from "@/app/_types/Pokeapi";
import { formatEffectiveness, formatStatistics, getRegionalForms } from "../../utils";
import PokemonCry from "@/app/_components/PokemonCry";
import IconType from "@/app/_components/IconType";
import PokemonForm from "@/app/_components/PokemonForm";
import PokemonBodyStyle from "@/app/_components/PokemonBodyStyle";
import ButtonPictureInPicture from "@/app/_components/ButtonPictureInPicture";

type PageProps = {
    params: Promise<{ id: string, name: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const getPkmn = cache(async (id: number | string, region: string | null = null) => {
    const res = await fetchPokemon(id, region);

    return res;
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
    const { id: queryId } = await searchParams!;

    let pkmn = await getPkmn(id, name);

    const listAllTypes = await fetchAllTypes();
    const listTypes = listAllTypes.map((item) => ({
        ...item,
        name: {
            fr: cleanString(item.name.fr),
            en: cleanString(item.name.en)
        },
    })) as IType[];

    if (pkmn === null || (pkmn as IPokemonError).status) {
        return {
            title: "Erreur",
        }
    }

    pkmn = (pkmn as IPokemon);

    const maxPercentage = 100;
    const isOneSex = pkmn.sexe?.female === maxPercentage || pkmn.sexe?.male === maxPercentage;

    const [pkmnExtraData, pkmnSpecies]: [IPokemonExtraData, IPokemonSpecies] = await Promise.all([
        fetchPokemonDetails(Number(queryId)) as Promise<IPokemonExtraData>,
        fetchPokemonExternalData(Number(pkmn.pokedex_id)) as Promise<IPokemonSpecies>
    ])

    const listPokemonTypes = pkmn.types.map((item: { name: string }) => item.name);
    const listSprites = Object.entries(pkmnExtraData.sprites.other.home).map(([key, value]) => {
        if (value === null) {
            return;
        }

        const sexLabel = value.includes("female") ? "female" : "male";
        return { key: sexLabel, sprite: value, name: key, is_shiny: key.includes("shiny") }
    }).filter(Boolean) as { key: string, sprite: string, name: string, is_shiny: boolean }[];

    const groupedSprites = Object.groupBy(listSprites, ({ key }) =>
        key === "female" ? "Femelle ♀" : "Mâle ♂"
    );

    const { listStatistics, totalBaseStat } = formatStatistics((pkmnExtraData as IPokemonExtraData).stats);
    const listEffectiveness = formatEffectiveness(pkmn.resistances, listTypes);

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

    const formsData = await getRegionalForms(
        Number(pkmn.pokedex_id),
        [{ region: "", name: { fr: "", en: "", jp: "" } }, ...(pkmn.formes || [])
        ]);

    const PkmnForm = ({ pipContent = null }: { pipContent?: ReactNode }) => (
        <div className="contents">
            <PokemonBodyStyle regionalTypes={listPokemonTypes} />
            <div
                style={{
                    borderImage: `linear-gradient(to right, var(--type-${cleanString(listPokemonTypes[0])}) 0%, var(--type-${cleanString(listPokemonTypes[0])}) 50%, var(--type-${cleanString(listPokemonTypes?.[1] || listPokemonTypes[0])}) 50%, var(--type-${cleanString(listPokemonTypes?.[1] || listPokemonTypes[0])}) 100%) 1`
                }}
                className="bg-gray-50 pt-2 pb-3 border-black border-solid border-b">

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center relative">
                    {pipContent && <ButtonPictureInPicture pipContent={pipContent} />}
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
                            {(pkmnSpecies.is_legendary || pkmnSpecies.is_mythical) && (
                                <span className={`py-0.5 ml-1.5 px-1.5 whitespace-nowrap text-black rounded-md text-xs align-super font-normal ${pkmnSpecies.is_legendary ? "bg-amber-400" : "bg-slate-400"}`}>
                                    {pkmnSpecies.is_legendary ? "Pokémon Légendaire" : "Pokémon Fabuleux"}
                                </span>
                            )}
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
            <header className="main-infos border-b text-black pb-4 mb-3 top-0">
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
                {/* <PokemonCry isModal color={`--dot-type-1-pip-color`} link={pkmnExtraData.cries.latest} /> */}
            </header>

            <details className="mb-3 @container/sensibilities">
                <summary className="hover:marker:text-[color:var(--dot-type-1-pip-color)] font-bold text-xl">Sensibilités</summary>
                <ul className="grid grid-cols-1 @md/sensibilities:grid-cols-2 @xl/sensibilities:grid-cols-3 gap-3 mt-3">
                    {listEffectiveness.map((item) => {
                        return (
                            <li className="flex gap-3" key={item.name.fr.clean}>
                                <IconType type={{ fr: item.name.fr.clean, en: item.name.en.clean }} />
                                <div>
                                    <p className={`-ml-2 py-0.5 px-2 rounded-md gap-1 flex items-center type-name w-fit bg-[var(--type-${item.name.fr.clean})]`} style={{
                                        backgroundColor: `var(--type-${item.name.fr.clean})`
                                    }}>{item.name.fr.raw}
                                    </p>
                                    <p className={`${item.is_effective ? "font-bold" : ""}`}>
                                        x{item.multiplier}
                                        {item.is_effective && (
                                            <span className={`ml-6 py-0.5 px-1.5 block -mt-7 whitespace-nowrap text-white rounded-md text-xs font-normal ${item.multiplier === 4 ? "bg-red-600" : "bg-slate-900"}`}>Double faiblesse</span>
                                        )}
                                    </p>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </details>

            <details className="mb-3">
                <summary className="hover:marker:text-[color:var(--dot-type-1-pip-color)] font-bold text-xl">Statistiques de base</summary>
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

            <details className="mb-3">
                <summary className="hover:marker:text-[color:var(--dot-type-1-pip-color)] font-bold text-xl">Sprites</summary>
                <div className="mt-3 grid gap-2 grid-flow-col-dense">
                    {Object.entries(groupedSprites).map(([key, _listSprites]) => {
                        let labelColorClass = key === "Femelle ♀" ? "bg-pink-300" : "bg-sky-300";
                        if (Object.entries(groupedSprites).length === 1 && !isOneSex) {
                            labelColorClass = "no-dimorphism";
                        }

                        return (
                            <div className="flex flex-col items-center" key={key}>
                                {pkmn.sexe !== null && (
                                    <p className={`text-center py-0.5 px-2.5 w-fit rounded-lg ${labelColorClass}`}>
                                        {(Object.entries(groupedSprites).length === 1 && !isOneSex) ? "Mâle ♂ / Femelle ♀" : key}
                                    </p>
                                )}
                                <ul
                                    className="flex flex-col gap-3 mt-2"
                                >
                                    {_listSprites.map((item) => (
                                        <li key={item.name}>
                                            <Image
                                                src={item.sprite}
                                                alt={`sprite de ${pkmn.name.fr}`}
                                                width={175}
                                                height={38}
                                                priority
                                            />
                                            {item.is_shiny && (
                                                <p className="text-center px-2">Chromatique
                                                    <span className="align-super sparkles">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 inline">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"></path>
                                                        </svg>
                                                    </span>
                                                </p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    })}
                </div>
            </details>
            <nav className="text-black">
                <p className="font-bold text-xl">Autres formes</p>
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                    {
                        (formsData.filter(Boolean)).map((item) => {
                            const pkmnFormId = getPkmnIdFromURL(pkmnSpecies.varieties.find((variety) => variety.pokemon.name.includes(item.region))?.pokemon.url || "");

                            return (
                                <li key={item.region}>
                                    <PokemonForm
                                        region={item.region}
                                        name={item.name}
                                        listTypes={item.types}
                                        pokedex_id={pkmn.pokedex_id}
                                        form_id={Number(pkmnFormId)}
                                        sprites={item.sprites}
                                        isModal
                                    />
                                </li>
                            )
                        })
                    }
                </ul>
            </nav>
        </div>
    )

    const pkmnFormComponent = (<PkmnForm />)

    return (
        <>
            <PokemonPage params={params} />
            <ModalWrapper>
                <PkmnForm pipContent={pkmnFormComponent} />
            </ModalWrapper>
        </>
    )
}

export default RegionPage;
