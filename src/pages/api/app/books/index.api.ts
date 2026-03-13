import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const querySchema = z.object({
    q: z.string(),
    startIndex: z.string().refine((startIndex) => !Number.isNaN(startIndex))
  })

  const { q, startIndex = 0 } = querySchema.parse(req.query)
  
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${q}&langRestrict=pt&orderBy=relevance&startIndex=${startIndex}&maxResults=20&key=${process.env.GOOGLE_BOOKS_API_KEY}`
  )

  const data = await response.json()

  const books = (data.items ?? [])
    ?.filter((book: any) =>  book.volumeInfo && book.volumeInfo.imageLinks?.thumbnail && book.volumeInfo.pageCount > 0 )
    .map((book: any) => ({
      id: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors ?? [],
      description: book.volumeInfo.description ?? null,
      thumbnail: book.volumeInfo.imageLinks?.thumbnail ?? null,
      pageCount: book.volumeInfo.pageCount,
      categories: book.volumeInfo.categories
    })) ?? []

    res.status(200).json({
    items: books,
    total: data.totalItems
  })
 
}