import fs from "fs";
import path from "path";

import Image from "next/image";
import { redirect } from 'next/navigation'

import Form from 'next/form';

import Uploader from "@/app/_components/Uploader";

const uploadDir = "./public/uploads";

import { FRENCH_GAMES_NAME, getCoverForName } from "@/app/_utils";

export default async function Page() {
    const listUploadedFilesRaw = await fs.readdirSync("./public/uploads");

    const listUploadedFiles = listUploadedFilesRaw
        .filter((item) => !item.includes(".gitignore"))
        .map((file) => `/uploads/${file}`);

    const onSubmit = async (formData: FormData) => {
        'use server'

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
        redirect('/administration')
    }

    return (
        <>
            <Form action={onSubmit}>
                <div className='flex items-stretch sm:items-center flex-col gap-2 mb-3'>
                    <Uploader />
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

                    {/* <label htmlFor="cover" className="text-sm
                                    py-2 px-4
                                    rounded-sm border-0
                                    bg-blue-700 hocus:bg-blue-950
                                    text-white text-center
                                    mt-auto
                                ">Sélectionner jaquette
                        <input type="file" className="w-0 h-0 file:hidden -z-50" required name="cover" id="cover" />
                    </label> */}
                </div>
                <button type="submit" className="bg-gray-200 hocus:bg-gray-600 hocus:text-white px-4 py-1 rounded-sm">Envoyer</button>
            </Form>

            <p className="text-xl font-bold mt-3">Liste des jaquettes uploadées</p>
            <ol className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {listUploadedFiles.map((item) => (
                    <li className="flex flex-col items-center" key={item}>
                        <Image
                            width={250}
                            height={250}
                            src={item}
                            alt={`jaquette de ${item}`}
                        />
                    </li>
                ))}
            </ol>
        </>
    )
}
