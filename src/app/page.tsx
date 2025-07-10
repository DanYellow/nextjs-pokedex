import Image from "next/image";

import { fetchPokemonForGeneration } from "@/app/_api/tyradex";
import PokedexEntry from "@/app/_components/PokedexEntry";

export default async function Home() {

    const data = await fetchPokemonForGeneration();
    // console.log(data)

    // <Image
    //       className="dark:invert"
    //       src="/next.svg"
    //       alt="Next.js logo"
    //       width={180}
    //       height={38}
    //       priority
    //     />

  return (
    <div>
      <main>
        <ol className="pokedex grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 mb-4 mx-auto max-w-6xl mt-2">
          {data.map((pokemon) => (
            <PokedexEntry key={pokemon.pokedex_id} name={pokemon.name.fr} sprite={pokemon.sprites.regular} >
            </PokedexEntry>
          ))}
        </ol>
      </main>
    </div>
  );
}
