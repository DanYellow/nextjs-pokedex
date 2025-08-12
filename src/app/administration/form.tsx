"use client"

import { startTransition, useState } from 'react';

import Uploader from "../_components/Uploader"
import { FRENCH_GAMES_NAME } from "@/app/_utils";
import { uploadGameAction, IGameCoverForm } from './form-actions';

const UploadForm = ({ onSubmitSuccess }: { onSubmitSuccess: (formData: FormData) => void }) => {
    const [formError, setFormError] = useState<IGameCoverForm | null>();

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                startTransition(() => {
                    const formActionRes = uploadGameAction(new FormData(e.currentTarget));
                    if (formActionRes) {
                        setFormError(formActionRes)
                    } else {
                        onSubmitSuccess(new FormData(e.currentTarget))
                    }
                });
            }}
        >
            <div className='flex items-stretch sm:items-center flex-col gap-2 mb-3'>
                <Uploader classNames="mt-5 md:w-2/3 lg:w-1/2 w-full" />
                <div className='w-full'>
                    {
                        formError?.errors?.cover?.map((errorMessage: string, index) => (
                            <p className='bg-red-100 mx-auto md:w-2/3 lg:w-1/2 w-full text-red-800 px-2.5 py-1.75 rounded-xl  mb-1.5' aria-live="polite" key={index}>{errorMessage}</p>
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
                            <p className='bg-red-100 text-red-800 px-2.5 py-1.75 rounded-xl mb-1.5' aria-live="polite" key={index}>{errorMessage}</p>
                        ))
                    }
                </div>
            </div>
            <button type="submit" className="bg-gray-200 hocus:bg-gray-600 hocus:text-white px-4 py-1 rounded-sm">Envoyer</button>
        </form>
    )
}

export default UploadForm;
