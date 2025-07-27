import fs from "fs";
import path from "path";

import { Metadata } from "next";
import Image from "next/image";
import { redirect } from 'next/navigation'
import Form from 'next/form';

import Uploader from "@/app/_components/Uploader";
import { FRENCH_GAMES_NAME, getCoverForName } from "@/app/_utils";

const uploadDir = "./public/uploads";

export const metadata: Metadata = {
    title: 'Administration',
}

export default async function Page() {
    const listUploadedFilesRaw = await fs.readdirSync("./public/uploads");

    const listUploadedFiles = listUploadedFilesRaw
        .filter((item) => !item.includes(".gitignore"))
        .map((file) => `/uploads/${file}`);

    const onSubmit = async (formData: FormData) => {
        'use server';

        const game = formData.get("game") as string;
        const file = formData.get("cover") as File;

        const ext = path.extname(file.name);

        const data = await file.arrayBuffer();
        const fileDestination = `${uploadDir}/${game}${ext}`;

        const existingFile = getCoverForName(game, listUploadedFilesRaw);
        if (existingFile) {
            await fs.unlinkSync(`./public/uploads/${existingFile}`);
        }

        await fs.appendFileSync(fileDestination, Buffer.from(data));
        redirect('/administration');
    }

    const res = []
    let i = 0;
    const NB_COLS = 5;
    const NB_ITEMS_PER_COL = Math.ceil(listUploadedFiles.length / NB_COLS);
    for (let index = 0; index < NB_COLS; index++) {
        const subArray = []
        for (let j = 0; j < NB_ITEMS_PER_COL; j++) {

            subArray.push(listUploadedFiles?.[i]);
            i++;
        }
        res.push(subArray.filter(Boolean))
    }


    return (
        <>
            <Form action={onSubmit}>
                <div className='flex items-stretch sm:items-center flex-col gap-2 mb-3'>
                    <Uploader classNames="mt-5 w-1/2" />
                    <div className="flex flex-col">
                        <label htmlFor="cover-select">Choisir jeu :</label>

                        <select id="cover-select" name="game" required>
                            <option value="">-- --</option>
                            {Object.entries(FRENCH_GAMES_NAME).map(([key, value]) => (
                                <option key={key} value={key}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <button type="submit" className="bg-gray-200 hocus:bg-gray-600 hocus:text-white px-4 py-1 rounded-sm">Envoyer</button>
            </Form>

            <p className="text-2xl font-bold mt-6">Liste des jaquettes uploadées</p>
            <ol className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-4">
                {res.map((group, idx) => (
                    <li className="flex flex-col items-center" key={idx}>
                        <ol className="flex flex-col gap-3 mb-4">
                            {group.map((item) => (
                                <li key={item}>
                                    <Image
                                        width={250}
                                        height={250}
                                        src={item}
                                        alt={`jaquette de ${item}`}
                                    />
                                </li>
                            ))}
                        </ol>
                    </li>
                ))}
            </ol>
        </>
    )
}
