import { prisma } from "@/lib/prisma"

interface GetHomeDataProps {
  userId: string
}

export async function getProfileData({ userId }: GetHomeDataProps) {

  const [
    userInfo,
    userRatings,
    allUserBooks,
    currentlyReadingBooks,
    finishedBooks,
    abandonedBooks,
    wantToReadBooks,
    favoriteBooks,
  ] = await Promise.all([

    prisma.user.findUnique({where: {
      id: userId
    }}),

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
      include: { book: true, user: true },
      orderBy: {
        updatedAt: "desc",
      },
    }),

    prisma.userBook.findMany({
      where: {
        userId,
        status: "READING",
      },
      include: { book: true, user: true },
      orderBy: {
        updatedAt: "desc",
      }
    }),
    
    prisma.userBook.findMany({
      where: {
        userId,
        status: "FINISHED",
      },
      include: { book: true, user: true },
      orderBy: {
        updatedAt: "desc",
      },
      
    }),

    prisma.userBook.findMany({
      where: {
        userId,
        status: "ABANDONED",
      },
      include: { book: true, user: true },
      orderBy: {
        updatedAt: "desc",
      }
    }),

    prisma.userBook.findMany({
      where: {
        userId,
        status: "WANT_TO_READ",
      },
      include: { book: true, user: true },
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
      include: { book: true, user: true },
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
    userInfo,
    userRatings,
    allUserBooks,
    currentlyReadingBooks,
    finishedBooks,
    abandonedBooks,
    wantToReadBooks,
    favoriteBooks,
  }
}