import { prisma } from "@/lib/prisma";

type CreateRatingProps = {
    userId: string
    bookId: string
    rate: number
    review: string
    title: string
    coverUrl: string
    author: string
    pageCount: number
    categories: string
}

export default async function createRatings(
    {userId, bookId, rate, review, author, coverUrl, pageCount, title, categories
}: CreateRatingProps){

    return prisma.$transaction(async (tx) => {

    let book = await tx.book.findUnique({
      where: {
        id: bookId
      }
    })

    if (!book) {
      book = await tx.book.create({
        data: {
          id: bookId,
          title,
          coverUrl,
          avgRating: rate,
          ratingsCount: 1,
          ratingsSum: rate,
          author,
          pageCount,
          categories  
        }
      })
    } else {

      const newRatingsCount = book.ratingsCount + 1
      const newRatingsSum = book.ratingsSum + rate
      const newAvg = newRatingsSum / newRatingsCount

      book = await tx.book.update({
        where: {
          id: book.id
        },
        data: {
          ratingsCount: newRatingsCount,
          ratingsSum: newRatingsSum,
          avgRating: newAvg
        }
      })
    }

    await tx.rating.create({
      data: {
        userId,
        bookId: book.id,
        rate,
        review,
      }
    })

    return 
  })
}