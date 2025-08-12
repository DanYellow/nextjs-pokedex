import LoginForm from "./form"

import FlashMessage from '@/app/_components/FlashMessage.server';

import { redirect, RedirectType } from 'next/navigation'



import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Connexion',
}

export default async function LoginPage({ searchParams }: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const { flash_message } = await searchParams!;
    console.log(await searchParams)
    if (flash_message) {
        redirect("/login", RedirectType.replace);
    }

    return (
        <main className="mx-auto max-w-2xl mt-2 pr-[max(env(safe-area-inset-right),_theme(space.4))] pl-[max(env(safe-area-inset-left),_theme(space.4))]">
            <FlashMessage />
            <h1 className='font-bold text-3xl mb-5'>Connexion</h1>
            <LoginForm />
        </main>

    )
}
