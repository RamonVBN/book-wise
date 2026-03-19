import { prisma } from "@/lib/prisma"
import { authOptions } from "@/pages/api/auth/[...nextauth].api"
import deleteRating from "@/services/deleteRating"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { z } from 'zod'

export async function deleteRatingController(req: NextApiRequest, res: NextApiResponse) {

  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const querySchema = z.object({
    ratingId: z.string(),
  })
  
  const { ratingId } = querySchema.parse(req.query)

   const rating = await prisma.rating.findUnique({
      where: {
        id: ratingId
      }
    })

    if(!rating) {
        res.status(400).json({message: 'Rating does not exists'})
    }

    if (rating?.userId !== session.user.id) {
        res.status(400).json({message: 'You cannot delete other user rating'})
    }
  
  await deleteRating({
    userId: session.user.id,
    ratingId,
    rate: rating!.rate,
    bookId: rating!.bookId
  })

  return res.status(200).json({})
}