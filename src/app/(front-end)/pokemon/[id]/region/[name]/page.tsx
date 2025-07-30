import { fetchPokemon } from "@/app/_api";
import { IPokemonError } from "@/app/_types/Pokemon";
import Image from "next/image";
import { cache } from "react";

import Modal from "@/app/(front-end)/pokemon/[id]/region/[name]/modal";
import PokemonPage from "@/app/(front-end)/pokemon/[id]/page";

type Props = {
    params: Promise<{ id: string, name: string }>
}

const getPkmn = cache(async (id: number | string, region: string | null = null) => {
    const res = await fetchPokemon(id, region)
    return res
})

async function RegionPage({
    params,
}: Props) {
    const { id, name } = await params;
    console.log(id, name)

    let pkmn = await getPkmn(id, name);

    if (pkmn === null || (pkmn as IPokemonError).status) {
        return {
            title: "Erreur",
        }
    }
    console.log(pkmn)

    return (
        <>
            <PokemonPage params={params} />
            <Modal>
                <p>efefe</p>
            </Modal>
        </>
    )
}

export default RegionPage;
