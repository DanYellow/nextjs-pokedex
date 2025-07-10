import Image from "next/image";

import { cleanString } from "@/app/_utils/index";

const TypeMarquee = ({ listTypes }: {listTypes: string[]}) => {
    return listTypes.map((type:string, typeIdx:number) => {
        return (
            <div key={type} style={{backgroundColor: `var(--type-${cleanString(type)})`}} className="marquee py-0.5 border-b border-solid border-white">
                {Array.from({length:7}).map((_, idx) => {
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

export default ({ name, sprite, listTypes }: { name: string, sprite: string, listTypes: { name: string; }[] }) => {

    return (
        <li className="@container/pokemon">
            <a data-pokemon-data data-pokemon-id className="pokemon ripple-effect duration-150 border-type-animated @xs:[.selected]:scale-100 [.selected]:scale-105 hocus:scale-105 @xs:hocus:scale-100 [.selected]:relative hocus:relative ease-out rounded-md py-2 group block border-solid border-transparent border-2 outline-offset-2 transition-transform" data-testid="pokemon">
                <div className="flex @xs:flex-row flex-col gap-3 items-center relative inert:opacity-50">
                    <div className="absolute overflow-hidden inset-0 opacity-0 transition-opacity group-[.selected]:opacity-100 group-hocus:opacity-100 @xs:hidden h-fit" data-marquee>
                        <TypeMarquee listTypes={listTypes.map((item) => item.name)} />
                    </div>
                    <Image
                        className="@xs:max-w-20 group-[.selected]:scale-85 group-hocus:scale-85 transition-transform"
                        src={sprite}
                        alt={`sprite de ${name}`}
                        width={180}
                        height={38}
                        loading="lazy"
                    />
                    <p data-pkmn-name className="group-hocus:pkmn-name group-[.selected]:pkmn-name @xs:text-left text-center whitespace-pre w-full">{name}</p>
                </div>
            </a>
        </li>
    )
}
