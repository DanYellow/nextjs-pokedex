import { FormEvent } from 'react'

import Form from 'next/form';
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Connexion',
}


export default async function LoginPage() {
    const onSubmit = async (formData: FormData) => {
        'use server';
        const cookieStore = await cookies()

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (email === "test@test.com" && password === "123456") {
            cookieStore.set('session', 'test', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7, // One week
                path: '/',
            })
        }
    }

    return (
        <main className="mx-auto max-w-2xl mt-2 pr-[max(env(safe-area-inset-right),_theme(space.4))] pl-[max(env(safe-area-inset-left),_theme(space.4))]">
            <h1 className='font-bold text-3xl mb-5'>Connexion</h1>
            <Form action={onSubmit} className='flex flex-col gap-2'>
                <div className='flex flex-col gap-1'>
                    <label htmlFor="email">E-mail</label>
                    <input type="email" name="email" required />
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" name="password" required />
                </div>
                <button type="submit" className='bg-blue-700 hocus:bg-blue-900 text-white p-2'>Connexion</button>
            </Form>
        </main>

    )
}
