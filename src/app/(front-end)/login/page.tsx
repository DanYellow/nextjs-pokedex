'use client'

import { useActionState } from 'react'

import Form from 'next/form';

import { logUser } from './form-actions';


import { Metadata } from 'next';

// export const metadata: Metadata = {
//     title: 'Connexion',
// }



export default function LoginPage() {
    const [state, formAction, pending] = useActionState(logUser, undefined)

    return (
        <main className="mx-auto max-w-2xl mt-2 pr-[max(env(safe-area-inset-right),_theme(space.4))] pl-[max(env(safe-area-inset-left),_theme(space.4))]">
            <h1 className='font-bold text-3xl mb-5'>Connexion</h1>
            <Form action={formAction} className='flex flex-col gap-2'>
                <div className='flex flex-col'>
                    <label htmlFor="email">E-mail</label>
                    <input type="email" className='rounded-md' defaultValue={state?.values.email} name="email" />
                    {state?.errors?.email && (
                        <div className='flex flex-row gap-2 bg-red-100 text-red-800 px-2.5 py-1.75'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                            </svg>
                            <div>
                                {
                                    state.errors.email.map((errorMessage: string) => (
                                        <p aria-live="polite">{errorMessage}</p>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="password">Mot de passe</label>
                    <input className='rounded-md' type="password" name="password" />
                    {state?.errors?.password && (
                        <div className='flex flex-row gap-2 bg-red-100 text-red-800 px-2.5 py-1.75'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                            </svg>
                            <div>
                                {
                                    state.errors.password.map((errorMessage: string) => (
                                        <p aria-live="polite">{errorMessage}</p>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </div>
                <button type="submit" inert={pending} className='bg-blue-700 hocus:bg-blue-900 text-white p-2'>Connexion</button>
            </Form>
        </main>

    )
}
