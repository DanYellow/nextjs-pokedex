import { fetchPokemonForGeneration } from "@/app/_api/tyradex";

import Pokedex from "@/app/_components/Pokedex";
import LayoutSwitch from "@/app/_components/LayoutSwitch";
import { LayoutProvider } from '@/app/_contexts/LayoutContext';
import { IPokemon } from "./_types/Pokemon";

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { id = 1 } = await searchParams;
    const { data, hasFoundGeneration } = await fetchPokemonForGeneration(id as number);

    return (
        <LayoutProvider>
            <header className="py-2 px-4 bg-slate-900 text-white sticky left-0 right-0 top-0 z-50 flex justify-between">
                <div>
                    <h2 className="text-2xl">
                        Génération #{id}
                    </h2>
                    <p className="py-0.5 px-2 rounded-md bg-slate-600 text-white inline-flex">
                        {hasFoundGeneration && <span>{String((data as IPokemon[])[0].pokedex_id).padStart(4, '0')} → {String(((data as IPokemon[]).at(-1) as IPokemon).pokedex_id).padStart(4, '0')}</span>}
                    </p>
                </div>

                <LayoutSwitch />
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
