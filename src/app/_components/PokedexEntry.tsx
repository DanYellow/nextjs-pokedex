import Image from "next/image";

import { cleanString, typesAnimatedBorderColor } from "@/app/_utils/index";

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

export default ({ id, name, sprite, listTypes: _listTypes }: { id: number, name: string, sprite: string, listTypes: { name: string; }[] }) => {

    const listTypes = _listTypes.map((item) => item.name)
    const listBorderClasses = typesAnimatedBorderColor[`${cleanString(listTypes[0])}_${cleanString(listTypes?.[1] || listTypes[0])}`].split(",").map((item: string) => item.trim())

    return (
        <li className="@container/pokemon">
            <a href={`/pokemon/${id}`}
                className={`pokemon ripple-effect duration-150 border-type-animated @xs:[.selected]:scale-100 [.selected]:scale-105 hocus:scale-105 @xs:hocus:scale-100 [.selected]:relative hocus:relative ease-out rounded-md py-2 group block border-solid border-transparent border-2 outline-offset-2 transition-transform ${listBorderClasses.join(" ")}`}
            >
                <div className="flex @xs:flex-row flex-col gap-3 items-center relative inert:opacity-50">
                    <div className="absolute overflow-hidden inset-0 opacity-0 transition-opacity group-[.selected]:opacity-100 group-hocus:opacity-100 @xs:hidden h-fit" data-marquee>
                        <TypeMarquee listTypes={listTypes} />
                    </div>
                    <Image
                        className="@xs:max-w-20 group-[.selected]:scale-85 group-hocus:scale-85 transition-transform"
                        src={sprite}
                        alt={`sprite de ${name}`}
                        width={175}
                        height={38}
                        loading="lazy"
                    />
                    <p className="group-hocus:pkmn-name group-[.selected]:pkmn-name @xs:text-left text-center whitespace-pre w-full">{name}</p>
                </div>
            </a>
        </li>
    )
}
