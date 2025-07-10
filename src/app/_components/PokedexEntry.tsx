import Image from "next/image";

export default ({ name, sprite }: { name: string, sprite: string }) => {
    return (
        <li className="@container/pokemon">
            <a data-pokemon-data data-pokemon-id className="pokemon ripple-effect duration-150 border-type-animated @xs:[.selected]:scale-100 [.selected]:scale-105 hocus:scale-105 @xs:hocus:scale-100 [.selected]:relative hocus:relative ease-out rounded-md py-2 group block border-solid border-transparent border-2 outline-offset-2 transition-transform" data-testid="pokemon">
                <div className="flex @xs:flex-row flex-col gap-3 items-center relative inert:opacity-50">
                    <div className="absolute overflow-hidden inset-0 opacity-0 transition-opacity group-[.selected]:opacity-100 group-hocus:opacity-100 @xs:hidden h-fit" data-marquee></div>
                    <Image
                        className="@xs:max-w-20 group-[.selected]:scale-85 group-hocus:scale-85 transition-transform"
                        src={sprite}
                        alt={`sprite de ${name}`}
                        width={180}
                        height={38}
                        priority
                    />

                    {/* <img src="/images/loading.svg" loading="lazy" alt="" className="@xs:max-w-20 group-[.selected]:scale-85 group-hocus:scale-85 transition-transform" /> */}
                    <p data-pkmn-name className="group-hocus:pkmn-name group-[.selected]:pkmn-name @xs:text-left text-center whitespace-pre w-full">{name}</p>
                </div>
            </a>
        </li>
    )
}
