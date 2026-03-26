import { prisma } from "@/lib/prisma"

interface GetHomeDataProps {
  userId: string
}

export async function getProfileData({ userId }: GetHomeDataProps) {

  const [
    userRatings,
    currentlyReadingBooks,
    finishedBooks,
    abandonedBooks,
    wantToReadBooks,
    favoriteBooks,
    stats,
  ] = await Promise.all([

    prisma.rating.findMany({
      where: { userId },
      include: { book: true, user: true },
    }),

    prisma.userBook.findMany({
      where: {
        userId,
        status: "READING",
      },
      include: { book: true },
    }),
    
    prisma.userBook.findMany({
      where: {
        userId,
        status: "FINISHED",
      },
      include: { book: true },
      orderBy: {
        updatedAt: "desc",
      },
    }),

    prisma.userBook.findMany({
      where: {
        userId,
        status: "ABANDONED",
      },
      include: { book: true },
    }),

    prisma.userBook.findMany({
      where: {
        userId,
        status: "WANT_TO_READ",
      },
      include: { book: true },
    }),

    prisma.userBook.findMany({
      where: {
        userId,
        isFavorite: true,
      },
      include: { book: true },
    }),


    prisma.userBook.groupBy({
      by: ["status"],
      where: { userId },
      _count: true,
    }),
  ])

  return {
    userRatings,
    currentlyReadingBooks,
    finishedBooks,
    abandonedBooks,
    wantToReadBooks,
    favoriteBooks,
    stats,
  }
}