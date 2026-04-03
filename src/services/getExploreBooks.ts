import { BookProps, BookStats } from "@/@types/query-types";
import { prisma } from "@/lib/prisma";

interface GetExploreBooks {
  userId?: string;
  q: string;
  startIndex: string | number;
}

export async function getExploreBooks({
  userId,
  q,
  startIndex,
}: GetExploreBooks) {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${q}&langRestrict=pt&orderBy=relevance&startIndex=${startIndex}&maxResults=20&key=${process.env.GOOGLE_BOOKS_API_KEY}`,
  );

  const data = await response.json();

  const books: BookProps[] =
    (data.items ?? [])
      ?.filter(
        (book: any) =>
          book.volumeInfo &&
          book.volumeInfo.categories &&
          book.volumeInfo.imageLinks?.thumbnail &&
          book.volumeInfo.pageCount > 0,
      )
      .map((book: any) => ({
        id: book.id,
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors ?? [],
        description: book.volumeInfo.description ?? null,
        coverUrl: book.volumeInfo.imageLinks?.thumbnail ?? null,
        pageCount: book.volumeInfo.pageCount,
        categories: book.volumeInfo.categories,
      })) ?? [];

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
        select: {
          id: true,
        },
      },
    },
  });

  const booksMap: Record<string, BookStats> = {};

  dbBooks.forEach((book: any) => {
    const userBook = book.userBooks.find((ub: any) => ub.userId === userId) ?? null;

    booksMap[book.id] = {
      avgRating: book.avgRating,
      ratingsCount: book.ratingsCount,
      ratingsSum: book.ratingsSum,
      userBookStatus: userBook?.status ?? null,
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

      avgRating: stats?.avgRating ?? 0,
      ratingsCount: stats?.ratingsCount ?? 0,
      ratingsSum: stats?.ratingsSum ?? 0,
      userBookStatus: stats?.userBookStatus ?? null,
    };
  });

  return result;
}
