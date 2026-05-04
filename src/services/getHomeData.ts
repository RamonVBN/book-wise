import { prisma } from "@/lib/prisma";
import { demoProfileData } from "@/mocks/profile";

interface GetHomeDataProps {
  userId?: string;
}

export async function getHomeData({ userId }: GetHomeDataProps) {
  
  const recentRatingsPromise = await prisma.rating.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      book: {
        include: {
          userBooks: {
            where: {
              userId: userId,
            },
            select: {
              id: true,
              status: true,
            },
          },
        },
      },
    },
  });

  const recentRatings = recentRatingsPromise.map((r) => {
    if (userId) {
      return {
        ...r,
        book: {
          id: r.book.id,
          title: r.book.title,
          author: r.book.author,
          coverUrl: r.book.coverUrl,
          pageCount: r.book.pageCount,
          categories: r.book.categories,
          userBookInfo: {
            userBookId: r.book.userBooks[0]?.id ?? null,
            loggedUserCurrentBookStatus: r.book.userBooks[0]?.status ?? null,
          },
        },
      };
    }

    const demoUb = demoProfileData.allUserBooks.find(
      (ub) => ub.book.id === r.book.id,
    );

    return {
      ...r,
      book: {
        id: r.book.id,
        title: r.book.title,
        author: r.book.author,
        coverUrl: r.book.coverUrl,
        pageCount: r.book.pageCount,
        categories: r.book.categories,
        userBookInfo: {
          userBookId: demoUb?.id ?? null,
          loggedUserCurrentBookStatus: demoUb?.status ?? null,
        },
      },
    };
  });

  const ranking = await prisma.$queryRaw<{ book_id: string }[]>`
    SELECT book_id
    FROM user_books
    WHERE status IN ('READING', 'WANT_TO_READ')
    GROUP BY book_id
    ORDER BY COUNT(*) DESC
    LIMIT 4
    `;

  const books = await prisma.book.findMany({
    where: {
      id: {
        in: ranking.map((r) => r.book_id),
      },
    },
    include: {
      userBooks: {
        where: {
          userId: userId,
        },
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  const popularBooks = ranking
    .map((rank) => books.find((book) => book.id === rank.book_id))
    .map((book) => {

      if (userId) {
        return {
          ...book,
          userBookInfo: {
            userBookId: book?.userBooks[0]?.id ?? null,
            loggedUserCurrentBookStatus: book?.userBooks[0]?.status ?? null,
          },
        };
      }

      const demoUb = demoProfileData.allUserBooks.find((ub) => ub.book.id === book?.id)

      return {
        ...book,
        userBookInfo: {
          userBookId: demoUb?.id ?? null,
          loggedUserCurrentBookStatus: demoUb?.status ??  null,
        },
      };
    });

  const lastUserRatingUpdate = userId
    ? prisma.rating.findFirst({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        include: {
          book: true,
        },
      })
    : null;

  const lastUserBookUpdate = userId
    ? prisma.userBook.findFirst({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        include: {
          book: true,
        },
      })
    : null;

  const lastUserActivtyPromise = Promise.all([
    lastUserRatingUpdate,
    lastUserBookUpdate,
  ]).then(([lastRating, lastUserBook]) => {
    if (!lastRating && !lastUserBook) {
      return null;
    }

    if (lastRating && lastUserBook) {
      return lastRating.updatedAt > lastUserBook.updatedAt
        ? lastRating
        : lastUserBook;
    }

    return lastRating || lastUserBook;
  });

  const [lastUserActivity] = await Promise.all([lastUserActivtyPromise]);

  return {
    recentRatings,
    popularBooks,
    lastUserActivity,
  };
}
