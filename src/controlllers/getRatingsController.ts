import { getRatings } from "@/services/getRating"
import { NextApiRequest, NextApiResponse } from "next"

import { z } from 'zod'

export async function getRatingsController(req: NextApiRequest, res: NextApiResponse) {

  const querySchema = z.object({
    bookId: z.string().optional(),
    userId: z.string().optional()
  })

  const { bookId, userId } = querySchema.parse(req.query)

  const ratings = await getRatings({
      bookId,
      userId
    })

  return res.json(ratings)
}