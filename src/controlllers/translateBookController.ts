import { getTranslatedBook } from "@/services/getTranslatedBook"
import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"


export async function translateBookController(req: NextApiRequest, res: NextApiResponse) {

    const bodySchema = z.object({
        categories: z.array(z.string()),
        description: z.string()
    })

    const { categories, description } = bodySchema.parse(req.body)


    const { translatedCategories, translatedDescription } = await getTranslatedBook({
        categories,
        description
    })

    res.status(201).json({
        categories: translatedCategories,
        description: translatedDescription
    })
  
}