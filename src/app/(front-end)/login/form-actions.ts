"use server";

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { z } from 'zod';

const LogInFormSchema = z.object({
    email: z
        .email({ message: 'E-mail absent' })
        .refine((value) => value === "test@test.fr", 'Adresse e-mail incorrecte')
        .trim(),
    password: z
        .string()
        .refine((value) => value === "123456", 'Mot de passe incorrect')
        .trim(),
})

interface ILogInForm {
    errors?: {
        email?: string[];
        password?: string[];
    };
    values: {
        email: string;
    }
}

export const logUser = async (prevState: any, formData: FormData): Promise<ILogInForm> => {
    'use server';
    const cookieStore = await cookies()

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validatedFields = LogInFormSchema.safeParse({
        email,
        password
    })

    if (validatedFields.success) {
        cookieStore.set('session', 'test', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // One week
            path: '/',
        });
        redirect("/administration")
    } else {
        return {
            errors: z.flattenError(validatedFields.error).fieldErrors,
            values: {
                email,
            }
        }
    }
}
