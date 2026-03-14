import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '../../auth/[...nextauth].api'
import { prisma } from '@/lib/prisma'
import { BookProps } from '@/@types/query-types'

interface BookStats {

  avgRating: number
  ratingsCount: number
  ratingsSum: number
  read: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if(req.method !== 'GET') {

    return res.status(405).json({message: 'Method not allowed'})
  }

  const session = await getServerSession(req, res, authOptions)

  const userId = session?.user.id

  const querySchema = z.object({
    q: z.string(),
    startIndex: z.string().refine((startIndex) => !Number.isNaN(startIndex))
  })

  const { q, startIndex = 0 } = querySchema.parse(req.query)
  
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${q}&langRestrict=pt&orderBy=relevance&startIndex=${startIndex}&maxResults=20&key=${process.env.GOOGLE_BOOKS_API_KEY}`
  )

  const data = await response.json()

  console.log(data)

  const books : BookProps[] = (data.items ?? [])
    ?.filter((book: any) =>  book.volumeInfo && book.volumeInfo.imageLinks?.thumbnail && book.volumeInfo.pageCount > 0 )
    .map((book: any) => ({
      id: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors ?? [],
      description: book.volumeInfo.description ?? null,
      coverUrl: book.volumeInfo.imageLinks?.thumbnail ?? null,
      pageCount: book.volumeInfo.pageCount,
      categories: book.volumeInfo.categories
    })) ?? []

    const googleIds = books.map((book: {id: string}) => book.id)

    const dbBooks = await prisma.book.findMany({
      where: {
        id: {
          in: googleIds
        }
      },
      include: {
        ratings: {
          where: {
            userId
          },
          select: {
            id: true
          }
        }
      }
    })

    const booksMap: Record<string, BookStats> = {}

    dbBooks.forEach(book => {
      booksMap[book.id] = {
        avgRating: book.avgRating,
        ratingsCount: book.ratingsCount,
        ratingsSum: book.ratingsSum,
        read: book.ratings.length > 0
      }
    })

    const result = books.map(book => {
      
    const stats = booksMap[book.id]
    return {
      id: book.id,
      title: book.title,
      authors: book.authors,
      description: book.description,
      coverUrl: book.coverUrl,
      pageCount: book.pageCount,
      categories: book.categories,
      
      avgRating: stats?.avgRating ?? 0,
      ratingsCount: stats?.ratingsCount ?? 0,
      ratingsSum: stats?.ratingsSum ?? 0,
      read: stats?.read ?? false
    }

})

    res.status(200).json({
    items: result,
    total: data.totalItems
  })
 
}