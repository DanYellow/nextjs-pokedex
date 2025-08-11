"use client"

import Form from 'next/form';
import { z } from 'zod';
import { useActionState, useEffect, useState } from 'react';

import Uploader from "../_components/Uploader"
import { FRENCH_GAMES_NAME } from "@/app/_utils";
import { uploadGameAction } from './form-actions';

const GameCoverFormSchema = z.object({
    cover: z
        .instanceof(File)
        .refine((file) => file?.size !== 0, "Image requise")
        .refine(
            (file) => {
                if (file?.size === 0) {
                    return true;
                }

                return ["image/png", "image/jpg", "image/jpeg", "image/avif"].includes(file.type);
            },
            "Format incorrect"
        )
        .refine((file) => {
            return file.size <= 1024 * 1024;
        }, {
            message: "File size should not exceed 5MB",
        })
    ,
    game: z
        .string().min(1, "Veuillez choisir un jeu"),
})

interface IGameCoverForm {
    errors?: {
        game?: string[];
        cover?: string[];
    };
}


const UploadForm = ({ onSubmitSuccess }: { onSubmitSuccess: (formData: FormData) => void }) => {
    const [formError, setFormError] = useState<IGameCoverForm>();
    const [formValues, setFormValues] = useState<{ game?: string, cover?: File } | {}>();

    const [state, formAction, pending] = useActionState(
        uploadGameAction,
        null
    );

    useEffect(() => {
        if (state?.values?.cover) {

        }
    }, [state])

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const game = formData.get("game") as string;
        const file = formData.get("cover") as File;

        const validatedFields = GameCoverFormSchema.safeParse({
            game,
            cover: file,
        })
        if (!validatedFields.success) {
            setFormError({
                errors: z.flattenError(validatedFields.error).fieldErrors
            })

            setFormValues({
                ...(game ? { game } : {}),
                ...(file ? { cover: file } : {}),
            })
        } else {
            onSubmitSuccess(formData)
        }
    }
            // e.preventDefault();
            // startTransition(() => uploadGameAction(new FormData(e.currentTarget)));

    return (
        <Form action={formAction}>
            <div className='flex items-stretch sm:items-center flex-col gap-2 mb-3'>
                <Uploader classNames="mt-5 md:w-2/3 lg:w-1/2 w-full" />
                <div className='w-full'>
                    {
                        state?.errors?.cover?.map((errorMessage: string, index) => (
                            <p className='bg-red-100 mx-auto md:w-2/3 lg:w-1/2 w-full text-red-800 px-2.5 py-1.75 rounded-xl  mb-1.5' aria-live="polite" key={index}>{errorMessage}</p>
                        ))
                    }
                </div>
                <div className="flex flex-col">
                    <label htmlFor="cover-select">Choisir jeu :</label>
                    <select id="cover-select" name="game" key={state?.values?.game} defaultValue={state?.values?.game}>
                        <option value="">-- --</option>
                        {Object.entries(FRENCH_GAMES_NAME).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    {
                        state?.errors?.game?.map((errorMessage: string, index) => (
                            <p className='bg-red-100 text-red-800 px-2.5 py-1.75 rounded-xl mb-1.5' aria-live="polite" key={index}>{errorMessage}</p>
                        ))
                    }
                </div>
            </div>
            <button type="submit" className="bg-gray-200 hocus:bg-gray-600 hocus:text-white px-4 py-1 rounded-sm">Envoyer</button>
        </Form>
    )
}

export default UploadForm;
