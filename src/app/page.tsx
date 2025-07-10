import { fetchPokemonForGeneration } from "@/app/_api/tyradex";
import PokedexEntry from "@/app/_components/PokedexEntry";

export default async function Home() {
    const data = await fetchPokemonForGeneration();

  return (
    <div>
      <main>
        <ol className="pokedex grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 mb-4 mx-auto max-w-6xl mt-2">
          {data.slice(0, 5).map((pokemon: any) => (
            <PokedexEntry
                key={pokemon.pokedex_id}
                id={pokemon.pokedex_id}
                name={pokemon.name.fr}
                sprite={pokemon.sprites.regular}
                listTypes={pokemon.types}
            />
          ))}
        </ol>
      </main>
    </div>
  );
}
