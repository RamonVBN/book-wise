import { authOptions } from "@/pages/api/auth/[...nextauth].api"
import { getBookRatings } from "@/services/getBookRatings"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"

import { z } from 'zod'

export async function getBookRatingsController(req: NextApiRequest, res: NextApiResponse) {

    const session = await getServerSession(req, res, authOptions)

    const querySchema = z.object({
        id: z.string().optional(),
    })

    const { id } = querySchema.parse(req.query)

    const ratings = await getBookRatings({
        bookId: id,
        userId: session?.user?.id
    })

    return res.json(ratings)
}