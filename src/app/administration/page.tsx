"use server"

import fs from "fs";
import path from "path";

import Form from 'next/form';

const uploadDir = "./public/uploads";

import { FRENCH_GAMES_NAME } from "@/app/_utils";
import Image from "next/image";


export default async function Page() {
    const listUploadedFilesRaw = await fs.readdirSync("./public/uploads");
    const istUploadedFiles = listUploadedFilesRaw
        .filter((item) => !item.includes(".gitignore"))
        .map((file) => `/uploads/${file}`);

    const onSubmit = async (formData: FormData) => {
        'use server'
        const game = formData.get("game");
        const file = formData.get("cover") as File;

        const ext = path.extname(file.name);

        const data = await file.arrayBuffer();
        const fileDestination = `${uploadDir}/${game}${ext}`;
        await fs.appendFileSync(fileDestination, Buffer.from(data));
    }

    return (
        <>
            <Form action={onSubmit}>
                <div className='flex items-center gap-2'>
                    <label htmlFor="pet-select">Sélectionner une jaquette :</label>
                    <select id="pet-select" name="game" required>
                        <option value="">-- --</option>
                        {Object.entries(FRENCH_GAMES_NAME).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value}
                            </option>
                        ))}

                    </select>
                    <input type="file" required name="cover" id="" />
                </div>
                <button type="submit" className="bg-gray-200 hocus:bg-gray-400 hocus:text-white px-2 py-1 rounded-sm">Envoyer</button>
            </Form>

            <p className="text-xl font-bold mt-3">Liste des jaquettes uploadées</p>
            <ol className="grid grid-cols-5 gap-2">
                {istUploadedFiles.map((item) => (
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
