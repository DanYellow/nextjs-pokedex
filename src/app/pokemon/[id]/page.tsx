import { fetchPokemon } from "@/app/_api/tyradex";

import { cleanString, typesAnimatedBorderColor } from "@/app/_utils/index";

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const pkmn = await fetchPokemon(Number(id))

    const listTypes = pkmn.types.map((item:{name:string}) => item.name)

    return (
        <div className="max-w-6xl mx-auto ">
            <header className="main-infos border-b text-black pb-4 mb-3 md:sticky landscape:static landscape:lg:sticky top-0">
                <div
                    style={{
                        borderImage: `linear-gradient(to right, var(--type-${cleanString(listTypes[0])}) 0%, var(--type-${cleanString(listTypes[0])}) 50%, var(--type-${cleanString(listTypes?.[1] || listTypes[0])}) 50%, var(--type-${cleanString(listTypes?.[1] || listTypes[0])}) 100%) 1`
                    }}
                    className="sticky-header relative px-4 bg-white top-0 pt-2 pb-3 border-black border-solid border-b">

                    <h1 className="text-3xl font-bold">#{String(id).padStart(4, '0')} {pkmn.name.fr}</h1>
                    <p className="text-sm -mt-1">{pkmn.category}</p>
                </div>
            </header>
        </div>
    )
}
