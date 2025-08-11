import { z } from 'zod';

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

export interface IGameCoverForm {
    errors?: {
        game?: string[];
        cover?: string[];
    };
}


export const uploadGameAction = (formData: FormData): IGameCoverForm | null => {
    const game = formData.get("game") as string;
    const file = formData.get("cover") as File;

    const validatedFields = GameCoverFormSchema.safeParse({
        game,
        cover: file,
    })

    if (!validatedFields.success) {
        return {
            errors: z.flattenError(validatedFields.error).fieldErrors,
        }
    }

    return null;
}
