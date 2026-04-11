import { BookProps, BookStats } from "@/@types/query-types";
import { prisma } from "@/lib/prisma";

interface GetExploreBooks {
  userId?: string;
  googleData: any;
}

export async function getExploreBooks({ userId, googleData }: GetExploreBooks) {
  const books: BookProps[] =
    (googleData ?? [])
      ?.filter(
        (book: any) =>
          book.volumeInfo &&
          book.volumeInfo.categories &&
          book.volumeInfo.imageLinks &&
          book.volumeInfo.pageCount > 0,
      )
      .map((book: any) => {
        const coverUrl =
          book.volumeInfo.imageLinks.extraLarge ||
          book.volumeInfo.imageLinks.large ||
          book.volumeInfo.imageLinks.medium ||
          book.volumeInfo.imageLinks.small ||
          book.volumeInfo.imageLinks.thumbnail ||
          book.volumeInfo.imageLinks.smallThumbnail;

        return {
          id: book.id,
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors ?? [],
          description: book.volumeInfo.description ?? null,
          coverUrl: coverUrl.replace("&edge=curl", "") ?? null,
          pageCount: book.volumeInfo.pageCount,
          categories: book.volumeInfo.categories ?? [],
        };
      }) ?? [];

  const googleIds = books.map((book: { id: string }) => book.id);

  const dbBooks = await prisma.book.findMany({
    where: {
      id: {
        in: googleIds,
      },
    },
    include: {
      userBooks: {
        where: {
          userId,
        },
      },
      ratings: {
        where: {
          userId,
        },
        include: {
          user: true,
        },
      },
    },
  });

  const booksMap: Record<string, BookStats> = {};

  dbBooks.forEach((dbBook: any) => {
    const userBook =
      dbBook.userBooks.find((ub: any) => ub.userId === userId) ?? null;

    booksMap[dbBook.id] = {
      avgRating: dbBook.avgRating,
      ratingsCount: dbBook.ratingsCount,
      ratingsSum: dbBook.ratingsSum,
      ratings: dbBook.ratings,
      userBookInfo: {
        status: userBook?.status,
        isFavorite: userBook?.isFavorite,
        rated: userBook?.rated,
      },
    };
  });

  const result = books.map((book) => {
    const stats = booksMap[book.id];

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      coverUrl: book.coverUrl,
      pageCount: book.pageCount,
      categories: book.categories,
      ratings: stats?.ratings ?? [],

      avgRating: stats?.avgRating ?? 0,
      ratingsCount: stats?.ratingsCount ?? 0,
      ratingsSum: stats?.ratingsSum ?? 0,
      userBookInfo: stats?.userBookInfo ?? null,
    };
  });

  return result;
}
