import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/pages/api/auth/[...nextauth].api'
import { getExploreBooks } from '@/services/getExploreBooks'

export async function getExploreBooksController(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const session = await getServerSession(req, res, authOptions)

  const userId = session?.user.id

  const querySchema = z.object({
    q: z.string(),
    startIndex: z.string().refine((startIndex) => !Number.isNaN(startIndex))
  })

  const { q, startIndex = 0 } = querySchema.parse(req.query)
  
  const books = await getExploreBooks({userId, q, startIndex})

  res.status(200).json({
  items: books,
  total: books.length
  })
 
}