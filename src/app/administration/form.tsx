"use client"

import Form from 'next/form';
import { z } from 'zod';

import Uploader from "../_components/Uploader"
import { FRENCH_GAMES_NAME } from "@/app/_utils";
import { useEffect, useState } from 'react';

const GameCoverFormSchema = z.object({
    cover: z
        .file({ message: 'File is required' })
        // .mime(["image/png", "image/jpg", "image/jpeg", "image/avif"], "Format incorrect")
        // .max(1024 * 1024, "Fichier trop lourd")
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

    useEffect(() => {
        console.log("ggggge")
    }, [])

    const handleSubmit = (formData: FormData) => {
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
        } else {
            onSubmitSuccess(formData)
        }
    }

    return (
        <Form action={handleSubmit}>
            <div className='flex items-stretch sm:items-center flex-col gap-2 mb-3'>
                <Uploader classNames="mt-5 md:w-2/3 lg:w-1/2 w-full" />
                <div>
                    {
                        formError?.errors?.cover?.map((errorMessage: string, index) => (
                            <p className='bg-red-100 text-red-800 px-2.5 py-1.75 rounded-xl' aria-live="polite" key={index}>{errorMessage}</p>
                        ))
                    }
                </div>
                <div className="flex flex-col">
                    <label htmlFor="cover-select">Choisir jeu :</label>

                    <select id="cover-select" name="game">
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
                        formError?.errors?.game?.map((errorMessage: string, index) => (
                            <p className='bg-red-100 text-red-800 px-2.5 py-1.75 rounded-xl' aria-live="polite" key={index}>{errorMessage}</p>
                        ))
                    }
                </div>
            </div>
            <button type="submit" className="bg-gray-200 hocus:bg-gray-600 hocus:text-white px-4 py-1 rounded-sm">Envoyer</button>
        </Form>
    )
}

export default UploadForm;
