import { getUserRatings } from "@/services/getUserRatings"
import { NextApiRequest, NextApiResponse } from "next"

import { z } from 'zod'

export async function getRatingsController(req: NextApiRequest, res: NextApiResponse) {

  const querySchema = z.object({
    id: z.string()
  })

  const { id } = querySchema.parse(req.query)

  const ratings = await getUserRatings({
      userId: id
    })

  return res.json(ratings)
}