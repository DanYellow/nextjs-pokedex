import { Metadata } from "next";

import { fetchPokemonForGeneration } from "@/app/_api/tyradex";

import Pokedex from "@/app/_components/Pokedex";
import LayoutSwitch from "@/app/_components/LayoutSwitch";
import { LayoutProvider } from '@/app/_contexts/LayoutContext';
import { IPokemon } from "@/app/_types/Pokemon";
import { Props as PageProps } from "@/app/_types/Page";

import GenerationDropdown from "@/app/_components/GenerationDropdown";
import GenerationRange from "@/app/_components/GenerationRange";

export async function generateMetadata(
    { searchParams }: PageProps
): Promise<Metadata> {
    const { id = 1 } = await searchParams

    let { hasFoundGeneration } = await fetchPokemonForGeneration(Number(id))

    if (!hasFoundGeneration) {
        return {
            title: "Erreur - Génération non trouvée",
        }
    }
    return {
        title: `Pokédex Génération #${id}`,
        openGraph: {
            title: `Pokédex Génération #${id}`,
        },
    }
}

export default async function Home({ searchParams }: PageProps) {
    const { id = 1 } = await searchParams;
    let { data, hasFoundGeneration } = await fetchPokemonForGeneration(Number(id));

    if (hasFoundGeneration) {
        data = (data as IPokemon[])
        data = data.filter((item: IPokemon) => {
            return item.pokedex_id >= (data as IPokemon[])[0].pokedex_id
        })
    }

    return (
        <LayoutProvider>
            <header className="py-2 bg-slate-900 text-white sticky left-0 right-0 top-0 z-[9999]">
                <div className="max-w-6xl mx-auto flex justify-between  pr-[max(env(safe-area-inset-right),_theme(space.4))] pl-[max(env(safe-area-inset-left),_theme(space.4))]">
                    <div className="flex flex-col landscape:max-lg:flex-row gap-x-2 justify-between items-center">
                        <label className="text-2xl block">
                            Génération&#8239;
                            <GenerationDropdown />
                        </label>
                        {hasFoundGeneration && (
                            <GenerationRange
                                firstPokemonGenerationNumber={(data as IPokemon[])[0]?.pokedex_id || 0}
                                lastPokemonGenerationNumber={((data as IPokemon[]).at(-1) as IPokemon)?.pokedex_id || 0}
                            />
                        )}
                    </div>

                    <LayoutSwitch />
                </div>
            </header>
            <main className="pr-[max(env(safe-area-inset-right),_theme(space.4))] pl-[max(env(safe-area-inset-left),_theme(space.4))]">
                {hasFoundGeneration && (<Pokedex data={(data as IPokemon[])} />)}
                {!hasFoundGeneration ? (
                    <p>Impossible d'afficher cette génération, car elle n'existe pas.</p>
                ) : null}
            </main>
        </LayoutProvider>
    );
}
