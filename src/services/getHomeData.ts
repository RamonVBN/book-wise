import { prisma } from "@/lib/prisma";

interface GetHomeDataProps {
  userId?: string;
}

export async function getHomeData({ userId }: GetHomeDataProps) {
  const recentRatingsPromise = prisma.rating.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      book: true,
    },
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
  });

  const popularBooks = ranking.map((rank) =>
    books.find((book) => book.id === rank.book_id),
  );

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

  const [recentRatings, lastUserActivity] = await Promise.all([
    recentRatingsPromise,
    lastUserActivtyPromise,
  ]);

  return {
    recentRatings,
    popularBooks,
    lastUserActivity,
  };
}
