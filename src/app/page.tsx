import { fetchPokemonForGeneration } from "@/app/_api/tyradex";
import Pokedex from "@/app/_components/Pokedex";
import LayoutSwitch from "@/app/_components/LayoutSwitch";

// import Wrapper from "./_components/Wrapper";

import { LayoutProvider } from '@/app/_contexts/LayoutContext';

export default async function Home() {
    const { data, hasReachedEnd } = await fetchPokemonForGeneration();

    return (
        <LayoutProvider>
            <header className="py-2 px-4 bg-slate-900 text-white sticky left-0 right-0">
                <LayoutSwitch />
            </header>
            {/* <div className="py-2 bg-slate-900 text-white fixed right-[max(env(safe-area-inset-right),_theme(space.3))] top-1/2 -translate-y-1/2 flex">
                </div> */}
            <main className="px-4">
                {!hasReachedEnd && <Pokedex data={data} />}
            </main>
        </LayoutProvider>
    );
}
