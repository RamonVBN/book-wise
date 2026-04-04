import { BookProps, BookStats } from "@/@types/query-types";
import { prisma } from "@/lib/prisma";

interface GetExploreBooks {
  userId?: string;
  googleData: any
}

export async function getExploreBooks({
  userId,
  googleData
}: GetExploreBooks) {

  const books: BookProps[] =
    (googleData ?? [])
      ?.filter(
        (book: any) =>
          book.volumeInfo &&
          book.volumeInfo.categories &&
          book.volumeInfo.imageLinks?.thumbnail &&
          book.volumeInfo.pageCount > 0,
      )
      .map((book: any) => {

        return {

          id: book.id,
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors ?? [],
          description: book.volumeInfo.description ?? null,
          coverUrl: book.volumeInfo.imageLinks?.thumbnail ?? null,
          pageCount: book.volumeInfo.pageCount,
          categories: book.volumeInfo.categories  ?? [],
        }
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
