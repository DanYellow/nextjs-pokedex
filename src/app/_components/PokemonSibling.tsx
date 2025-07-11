import type { IPokemonAbilityComplete, IPokemonType, IPokemon } from "@/app/_types/Pokemon";


interface IPokemonSibling extends IPokemon {
    isCurrentPkmn: boolean;
}

export default ({isCurrentPkmn, name, pokedex_id, sprites }: IPokemonSibling) => {
    if (isCurrentPkmn) {
        return (
            <div className={`
                pkmn-sibling h-full group-last:flex-row-reverse flex gap-5 items-center
            `}>
                <div>
                    <p className="text-sm">{pokedex_id}</p>
                    <p>{name.fr}</p>
                </div>
            </div>
        )
    }

    return (
        <a href="" className="pkmn-sibling ripple-effect h-full group-last:flex-row-reverse flex gap-5 items-center group border-transparent transition-colors border-2 border-solid rounded-lg p-2 outline-offset-2 !opacity-100">
            {!isCurrentPkmn ? <img className="w-12" src={sprites.regular} alt="" /> : null}
            <div>
                <p className="text-sm">{pokedex_id}</p>
                <p>{name.fr}</p>
            </div>
        </a>
    )
}
