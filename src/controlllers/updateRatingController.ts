import { prisma } from "@/lib/prisma"
import { authOptions } from "@/pages/api/auth/[...nextauth].api"
import updateRating from "@/services/updateRating"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { z } from 'zod'

export async function updateRatingController(req: NextApiRequest, res: NextApiResponse) {

  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const querySchema = z.object({
    ratingId: z.string(),
  })

  const bodySchema = z.object({
    newReview: z.string(),
    newRate: z.number()
  })
  
  const { newRate, newReview } = bodySchema.parse(req.body)
  
  const { ratingId } = querySchema.parse(req.query)

  const rating = await prisma.rating.findUnique({
      where: {
        id: ratingId
      }
    })

    if(!rating) {
      return res.status(400).json({message: 'Rating does not exists'})
    }

    if (rating.userId !== session.user.id) {
      return res.status(400).json({message: 'You cannot delete other user rating'})
    }

  await updateRating({
    ratingId,
    bookId: rating!.bookId,
    newRate,
    newReview 
  })

  return res.status(200).json({})
}