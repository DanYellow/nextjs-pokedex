import { Metadata, ResolvingMetadata } from "next";

import { fetchPokemonForGeneration } from "@/app/_api/tyradex";

import Pokedex from "@/app/_components/Pokedex";
import LayoutSwitch from "@/app/_components/LayoutSwitch";
import { LayoutProvider } from '@/app/_contexts/LayoutContext';
import { IPokemon } from "./_types/Pokemon";
import { Props as PageProps } from "./_types/Page";

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
        title: `Pokédex génération #${id}`,
        openGraph: {
            title: `Pokédex génération #${id}`,
        },
    }
}

export default async function Home({ searchParams }: PageProps) {
    const { id = 1 } = await searchParams;
    const { data, hasFoundGeneration } = await fetchPokemonForGeneration(Number(id));

    return (
        <LayoutProvider>
            <header className="py-2 px-4 bg-slate-900 text-white sticky left-0 right-0 top-0 z-50 ">
                <div className="max-w-6xl flex justify-between mx-auto px-4">
                    <div>
                        <h2 className="text-2xl">
                            Génération #{id}
                        </h2>
                        {hasFoundGeneration && (<p className="py-0.5 px-2 rounded-md bg-slate-600 text-white inline-flex">
                            <span>{String((data as IPokemon[])[0].pokedex_id).padStart(4, '0')} → {String(((data as IPokemon[]).at(-1) as IPokemon).pokedex_id).padStart(4, '0')}</span>
                        </p>)}
                    </div>

                    <LayoutSwitch />
                </div>
            </header>
            <main className="px-4">
                {hasFoundGeneration && (<Pokedex data={(data as IPokemon[])} />)}
                {!hasFoundGeneration ? (
                    <p>Impossible d'afficher cette génération, car elle n'existe pas.</p>
                ) : null}
            </main>
        </LayoutProvider>
    );
}
