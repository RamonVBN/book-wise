import { prisma } from "@/lib/prisma"

interface GetHomeDataProps {
  userId: string
}

export async function getProfileData({ userId }: GetHomeDataProps) {

  const [
    userRatings,
    allUserBooks,
    currentlyReadingBooks,
    finishedBooks,
    abandonedBooks,
    wantToReadBooks,
    favoriteBooks,
  ] = await Promise.all([

    prisma.rating.findMany({
      where: { userId },
      include: { book: true, user: true },
      orderBy: {
        updatedAt: "desc",
      }
    }),

    prisma.userBook.findMany({
      where: {
        userId,
      },
      include: { book: true },
      orderBy: {
        updatedAt: "desc",
      },
    }),

    prisma.userBook.findMany({
      where: {
        userId,
        status: "READING",
      },
      include: { book: true },
      orderBy: {
        updatedAt: "desc",
      }
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
      orderBy: {
        updatedAt: "desc",
      }
    }),

    prisma.userBook.findMany({
      where: {
        userId,
        status: "WANT_TO_READ",
      },
      include: { book: true },
      orderBy: [
        { wantToReadPosition: {
          sort: 'asc',
          nulls: 'last'
        } },
        {updatedAt: 'desc'}
      ]
    }),

    prisma.userBook.findMany({
      where: {
        userId,
        isFavorite: true,
      },
      include: { book: true },
      orderBy: [
        { favoritePosition: {
          sort: 'asc',
          nulls: 'last'
        } },
        {updatedAt: 'desc'}
      ]
    }),

  ])

  return {
    userRatings,
    allUserBooks,
    currentlyReadingBooks,
    finishedBooks,
    abandonedBooks,
    wantToReadBooks,
    favoriteBooks,
  }
}