import { prisma } from "@/lib/prisma";

type GetRatingProps = {

    bookId: string | undefined
    userId: string | undefined
}

export async function getRatings({bookId, userId}: GetRatingProps) {

  const ratings = await prisma.rating.findMany({
    where: {
      ...(bookId && { bookId }),
      ...(userId && { userId })
    },
    include: {
      user: true,
      book: true
    },
    take: 10,
    orderBy: {
      createdAt: "desc"
    }
  })

  return ratings
}