import { translateText } from "@/lib/translate"
import { translateList } from "@/utils/translateList"
import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"


export async function translateBookController(req: NextApiRequest, res: NextApiResponse) {

    const bodySchema = z.object({

        categories: z.array(z.string()),
        description: z.string()
    })

    const { categories, description } = bodySchema.parse(req.body)

    const translatedCategories = await translateList(categories)
    const translatedDescription = await translateText(description)

    res.status(201).json({
        categories: translatedCategories,
        description: translatedDescription
    })
  
}