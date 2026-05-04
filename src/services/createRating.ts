import { prisma } from "@/lib/prisma"

type CreateRatingProps = {
  userId: string
  bookId: string
  rate: number
  review: string
}

export default async function createRatings({
  userId,
  bookId,
  rate,
  review,
}: CreateRatingProps) {
  return prisma.$transaction(async (tx) => {

    const book = await tx.book.findUnique({
      where: {
        id: bookId,
      },
    })

    if (!book) {
      return
    }

    const newRatingsCount = book.ratingsCount + 1
    const newRatingsSum = book.ratingsSum + rate
    const newAvg = newRatingsSum / newRatingsCount

    await tx.book.update({
      where: {
        id: book.id,
      },
      data: {
        ratingsCount: newRatingsCount,
        ratingsSum: newRatingsSum,
        avgRating: newAvg,
      },
    })

    await tx.rating.create({
      data: {
        userId,
        bookId: book.id,
        rate,
        review,
      },
    })

    await tx.$executeRawUnsafe(
      `
      UPDATE "user_books"
      SET "rated" = $1
      WHERE "user_id" = $2
      AND "book_id" = $3
      `,
      true,
      userId,
      book.id,
    )

    return
  })
}
