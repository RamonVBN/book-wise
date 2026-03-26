import { prisma } from "@/lib/prisma";

type GetBookRatingProps = {
  bookId: string | undefined
  userId: string | undefined
}

export async function getBookRatings({bookId, userId}: GetBookRatingProps) {

  const ratings = await prisma.rating.findMany({
    where: {
      ...(bookId && { bookId }),
    },
    include: {
      book: true,
      user: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  if (!bookId) {
    return ratings
  }
  
  let userStatus = null

  if (userId) {
    userStatus = await prisma.userBook.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId
        }
      }
    })
  }

  const result = {
    ratings,
    userStatus
  }

  console.log(result)

  return result
}