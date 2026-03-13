import { getRatings } from "@/services/getRating"
import { NextApiRequest, NextApiResponse } from "next"

export async function getRatingsController(req: NextApiRequest, res: NextApiResponse) {

  const { bookId, userId } = req.query

  const ratings = await getRatings({
      bookId: bookId as string | undefined,
      userId: userId as string | undefined
    })

  return res.json(ratings)
}