'use client'

import { useState } from "react";
import Image from "next/image";

import { cleanString, typesAnimatedBorderColor, NB_NUMBER_INTEGERS_PKMN_ID } from "@/app/_utils/index";

const TypeMarquee = ({ listTypes }: { listTypes: string[] }) => {
    return listTypes.map((type: string, typeIdx: number) => {
        return (
            <div key={type} style={{ backgroundColor: `var(--type-${cleanString(type)})` }} className="marquee py-0.5 border-b border-solid border-white">
                {Array.from({ length: 7 }).map((_, idx) => {
                    return (
                        <p
                            key={idx}
                            aria-hidden="true"
                            style={{ animationDirection: typeIdx === 1 ? "reverse" : "normal" }}
                            className="marquee-text type-name px-1 text-sm group-hocus:animation-play animation-pause">
                            {type}
                        </p>
                    )
                })}
            </div>
        )
    })
}

export default ({ id, name, sprite, listTypes: _listTypes }: { id: number, name: string, sprite: string, listTypes: { name: string; }[] }) => {
    const listTypes = _listTypes.map((item) => item.name);
    const listBorderClasses = typesAnimatedBorderColor[`${cleanString(listTypes[0])}_${cleanString(listTypes?.[1] || listTypes[0])}`]

    const [hasGenerateMarquee, setHasGenerateMarquee] = useState<boolean>(false);

    return (
        <li className="@container/pokemon" >
            <a href={`/pokemon/${id}`}
                id={`pkmn-${id}`}
                className={`
                    pokemon ripple-effect duration-150
                    border-type-animated
                    hocus:scale-105 @xs:hocus:scale-100
                    hocus:relative ease-out rounded-md py-2 group block border-solid
                    border-transparent border-2 outline-offset-2 transition-transform ${listBorderClasses}
                    ${window.location.hash === `#pkmn-${id}` ? "bg-slate-200" : ""}
                `}
                onMouseOver={() => setHasGenerateMarquee(true)}
                onFocus={() => setHasGenerateMarquee(true)}
                aria-label={`Voir fiche de ${name}`}
            >
                <div className="flex @xs:flex-row flex-col gap-3 items-center relative inert:opacity-50">
                    {
                        hasGenerateMarquee && (
                            <div className="absolute overflow-hidden inset-0 opacity-0 transition-opacity group-[.selected]:opacity-100 group-hocus:opacity-100 @xs:hidden h-fit">
                                <TypeMarquee listTypes={listTypes} />
                            </div>
                        )
                    }

                    <Image
                        className="@xs:max-w-20 group-[.selected]:scale-85 group-hocus:scale-85 transition-transform"
                        src={sprite}
                        alt={`sprite de ${name}`}
                        width={110}
                        height={110}
                        placeholder="blur"
                        loading="lazy"
                        blurDataURL="/images/loading.svg"
                    />
                    <div>
                        <p className="group-hocus:pkmn-name group-[.selected]:pkmn-name @xs:text-left text-center whitespace-pre w-full">
                            #{String(id).padStart(NB_NUMBER_INTEGERS_PKMN_ID, '0')}<br />{name}
                        </p>
                        <ul className=" gap-1.5 mt-2 hidden @xs:flex">
                            {listTypes.map((type) => {
                                // const typeFrClean = type.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                                // const typeEnClean = typesEnglish[typeFrClean]
                                return (
                                    <li key={type} className="type-name py-0.5 px-1.5 text-sm rounded-md gap-1 flex flex-row" style={{ backgroundColor: `var(--type-${cleanString(type)})` }}>
                                        <Image
                                            className="h-5"
                                            src={`https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/${type.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()}.png`}
                                            alt={`icône type ${type}`}
                                            width={20}
                                            height={20}
                                        />
                                        {type}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                </div>
            </a>
        </li>
    )
}
