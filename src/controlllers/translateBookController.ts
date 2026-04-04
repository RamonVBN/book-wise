import { translateList } from "@/utils/translateList"
import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"


export async function translateBookController(req: NextApiRequest, res: NextApiResponse) {

    const bodySchema = z.object({

        categories: z.array(z.string()),
        // description: z.string()
    })

    const { categories } = bodySchema.parse(req.body)

    const translatedCategories = await translateList(categories)

    res.status(201).json({
        categories: translatedCategories
    })
  
}