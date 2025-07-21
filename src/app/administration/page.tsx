// "use server"


import fs from "fs";
import path from "path";

import Form from 'next/form';

const uploadDir = "./public/uploads";


export default async function Page() {
    const files = await fs.readdirSync("./public/uploads");
    const images = files
        .filter((file) => file.endsWith(".jpg"))
        .map((file) => `/uploads/${file}`);
    console.log(images)

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
        <Form action={onSubmit}>
            <div className='flex items-center'>
                <label htmlFor="pet-select">Select pet:</label>
                <select id="pet-select" name="game">
                    <option value="">Please select a pet</option>
                    <option value="rouge">
                        Pokémon Rouge
                    </option>
                </select>
                <input type="file" name="cover" id="" />
            </div>
            <button type="submit">Submit</button>
        </Form>
    )
}
