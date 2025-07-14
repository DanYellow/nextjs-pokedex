import { NB_NUMBER_INTEGERS_PKMN_ID } from "@/app/_utils"

export default ({ firstPokemonGenerationNumber, lastPokemonGenerationNumber }: { firstPokemonGenerationNumber: number; lastPokemonGenerationNumber: number }) => {
    return (
        <p className="py-0.5 px-2 rounded-md bg-slate-600 text-white inline-flex self-start">
            <span>{String(firstPokemonGenerationNumber).padStart(NB_NUMBER_INTEGERS_PKMN_ID, '0')} ➜ {String(lastPokemonGenerationNumber).padStart(NB_NUMBER_INTEGERS_PKMN_ID, '0')}</span>
        </p>
    )
}
