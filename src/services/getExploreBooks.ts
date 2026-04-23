import { BookProps, BookStats } from "@/@types/query-types";
import { prisma } from "@/lib/prisma";
import { demoProfileData } from "@/mocks/profile";
import { getBestBookCover } from "@/utils/getBestBookCover";

interface GetExploreBooks {
  userId?: string;
  googleData: any;
}

export async function getExploreBooks({ userId, googleData }: GetExploreBooks) {
  const books: BookProps[] =
    (await Promise.all(
      (googleData ?? [])
        ?.filter(
          (book: any) =>
            book.volumeInfo &&
            book.volumeInfo.categories &&
            book.volumeInfo.imageLinks &&
            book.volumeInfo.pageCount > 0,
        )
        .map(async (book: any) => {
          const googleCoverUrl =
            book.volumeInfo.imageLinks.extraLarge ||
            book.volumeInfo.imageLinks.large ||
            book.volumeInfo.imageLinks.medium ||
            book.volumeInfo.imageLinks.small ||
            book.volumeInfo.imageLinks.thumbnail ||
            book.volumeInfo.imageLinks.smallThumbnail;

          const coverUrl = await getBestBookCover({
            googleCover: googleCoverUrl,
            industryIdentifiers: book.volumeInfo.industryIdentifiers,
          });

          return {
            id: book.id,
            title: book.volumeInfo.title,
            author: book.volumeInfo.authors ?? [],
            description: book.volumeInfo.description ?? null,
            coverUrl: coverUrl ?? null,
            pageCount: book.volumeInfo.pageCount,
            categories: book.volumeInfo.categories ?? [],
          };
        }),
    )) ?? [];

  const googleIds = books.map((book: { id: string }) => book.id);

  if (userId) {
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
          userBookId: userBook?.id,
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

  const demoUserBooks = demoProfileData.allUserBooks

  const booksMap: Record<string, BookStats> = {};

  demoUserBooks.forEach((ub) => {
  
    booksMap[ub.book.id] = {
      avgRating: 0,
      ratingsCount: 0,
      ratingsSum: 0,
      ratings: [],
      userBookInfo: {
        userBookId: ub.id,
        status: ub.status,
        isFavorite: ub.isFavorite,
        rated: ub.rated,
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
