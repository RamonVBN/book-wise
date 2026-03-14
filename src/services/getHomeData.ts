import { prisma } from "@/lib/prisma"

interface GetHomeDataProps {
  userId?: string
}

export async function getHomeData({ userId }: GetHomeDataProps) {

  const recentRatingsPromise = prisma.rating.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      book: true
    }
  })

  const popularBooksPromise = prisma.book.findMany({
    take: 4,
    orderBy: {
      ratings: {
        _count: "desc"
      },
    },
    include: {
      ratings: true
    }
  })

  const lastUserReadingPromise = userId
    ? prisma.rating.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
          book: true
        }
      })
    : null

  const [recentRatings, popularBooks, lastUserReading] = await Promise.all([
    recentRatingsPromise,
    popularBooksPromise,
    lastUserReadingPromise
  ])

  return {
    recentRatings,
    popularBooks,
    lastUserReading
  }
}