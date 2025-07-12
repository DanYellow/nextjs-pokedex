import { fetchPokemonForGeneration } from "@/app/_api/tyradex";

import Pokedex from "@/app/_components/Pokedex";
import LayoutSwitch from "@/app/_components/LayoutSwitch";
import { LayoutProvider } from '@/app/_contexts/LayoutContext';

export default async function Home() {
    const { data, hasReachedEnd } = await fetchPokemonForGeneration();

    return (
        <LayoutProvider>
            <header className="py-2 px-4 bg-slate-900 text-white sticky left-0 right-0 top-0 z-50">
                <LayoutSwitch />
            </header>
            <main className="px-4">
                {!hasReachedEnd && <Pokedex data={data} />}
            </main>
        </LayoutProvider>
    );
}
