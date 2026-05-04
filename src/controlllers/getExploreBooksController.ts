import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth].api"
import { getExploreBooks } from "@/services/getExploreBooks"

export async function getExploreBooksController(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions)

  const userId = session?.user.id

  const googleData = req.body.googleData

  if (!googleData) {
    return res.status(400).json({ message: "Google data is required" })
  }

  const books = await getExploreBooks({
    userId,
    googleData: req.body.googleData,
  })

  res.status(200).json({
    items: books,
    total: books.length,
  })
}
