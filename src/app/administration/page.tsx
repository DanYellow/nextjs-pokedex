import fs from "fs";
import path from "path";

import { Metadata } from "next";
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

import { getCoverForName } from "@/app/_utils";
import UploadedFiles from "@/app/_components/UploadedFiles";
import UploadForm from "./form";

const uploadDir = "./public/uploads";

export const metadata: Metadata = {
    title: 'Administration',
}

// https://nextjs.org/docs/app/api-reference/file-conventions/loading

export default async function Page() {
    const cookieStore = await cookies()
    const cookie = cookieStore.get('session')?.value;

    if (!cookie) {
        redirect('/login?flash_message=sentreset')
    }

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

    return (
        <>
            <UploadForm onSubmitSuccess={onSubmit} />
            <p className="text-2xl font-bold mt-6">Liste des jaquettes uploadées</p>
            <UploadedFiles data={listUploadedFiles} />
        </>
    )
}
