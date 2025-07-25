import Link from "next/link"

export default function AdministrationLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <header className="py-2 bg-slate-900 text-white sticky left-0 right-0 top-0 z-[9999]">
                <div className="max-w-6xl mx-auto flex justify-between  pr-[max(env(safe-area-inset-right),_theme(space.4))] pl-[max(env(safe-area-inset-left),_theme(space.4))]">
                    <h1 className="text-2xl">Administration</h1>
                    <Link href="/">Retour au Pokédex</Link>
                </div>
            </header>
            <main className="mx-auto max-w-6xl mt-2 pr-[max(env(safe-area-inset-right),_theme(space.4))] pl-[max(env(safe-area-inset-left),_theme(space.4))]">
                {children}
            </main>
        </>
    )
}
