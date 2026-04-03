import { authOptions } from "@/pages/api/auth/[...nextauth].api"
import updateUserBook from "@/services/updateUserBook"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { z } from 'zod'

export async function updateUserBookController(req: NextApiRequest, res: NextApiResponse) {

  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const bodySchema = z.object({
    isFavorite: z.boolean().optional(),
    currentPage: z.number().optional(),
    readStatus: z.enum(["WANT_TO_READ", "READING", "FINISHED", "ABANDONED"]).optional(),

    bookId: z.string(),
    title: z.string(),
    author: z.string(),
    coverUrl: z.string(),
    pageCount: z.number(),
    categories: z.string()
  })
  
  const 
  { bookId, author, coverUrl, pageCount, title, categories, readStatus,  isFavorite, currentPage } = 
  bodySchema.parse(req.body)
  
  await updateUserBook({
    userId: session.user.id,
    bookId,
    readStatus,
    isFavorite,
    currentPage,
    author,
    coverUrl,
    pageCount,
    title,
    categories
  })

  return res.status(200).json({})
}