import { BookProps, BookStats } from "@/@types/query-types";
import { prisma } from "@/lib/prisma";
import { getBestBookCover } from "@/utils/getBestBookCover";

interface GetExploreBooks {
  userId?: string;
  googleData: any;
}

export async function getExploreBooks({ userId, googleData }: GetExploreBooks) {
  const books: BookProps[] =  await Promise.all(
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

          const coverUrl = await getBestBookCover({googleCover: googleCoverUrl, industryIdentifiers: book.volumeInfo.industryIdentifiers})

        return {
          id: book.id,
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors ?? [],
          description: book.volumeInfo.description ?? null,
          coverUrl: coverUrl ?? null,
          pageCount: book.volumeInfo.pageCount,
          categories: book.volumeInfo.categories ?? [],
        };
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





// interface GetExploreBooks {
//   userId?: string;
//   googleData: any;
//   searchTerm?: string;
// }

// /*
// Detecta automaticamente o autor dominante
// somente entre títulos similares ao searchTerm
// */
// function getDominantAuthor(
//   books: BookProps[],
//   searchTerm?: string
// ) {
//   if (!searchTerm || books.length < 3) return null;

//   const counter = new Map<string, number>();
//   const normalizedSearch = searchTerm.toLowerCase();

//   books.forEach((book) => {
//     const title = book.title.toLowerCase();

//     if (!title.includes(normalizedSearch)) return;

//     book.author.forEach((author) => {
//       counter.set(author, (counter.get(author) ?? 0) + 1);
//     });
//   });

//   return [...counter.entries()]
//     .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
// }

// /*
// Sistema híbrido de scoring:
// funciona com e sem searchTerm
// */
// function scoreBook(
//   book: BookProps,
//   stats: BookStats | undefined,
//   searchTerm?: string,
//   dominantAuthor?: string
// ) {
//   let score = 0;

//   // 🔎 modo busca textual
//   if (searchTerm) {
//     const normalizedSearch = searchTerm.toLowerCase();
//     const title = book.title.toLowerCase();

//     if (title === normalizedSearch) score += 100;

//     if (title.includes(normalizedSearch)) score += 50;

//     if (
//       dominantAuthor &&
//       book.author.includes(dominantAuthor)
//     ) {
//       score += 40;
//     }
//   }

//   // 🏷 modo categoria (sem searchTerm)
//   if (!searchTerm) {
//     if (stats?.ratingsCount) {
//       score += stats.ratingsCount * 0.05;
//     }

//     if (stats?.avgRating) {
//       score += stats.avgRating * 10;
//     }
//   }

//   // ⭐ critérios universais

//   if (book.coverUrl) score += 10;

//   if (book.pageCount > 100) score += 5;

//   return score;
// }

// export async function getExploreBooks({
//   userId,
//   googleData,
//   searchTerm,
// }: GetExploreBooks) {

//   /*
//   Normaliza dados vindos do Google Books
//   */

//   const books: BookProps[] =
//     (await Promise.all(
//       (googleData ?? [])
//         ?.filter(
//           (book: any) =>
//             book.volumeInfo &&
//             book.volumeInfo.categories &&
//             book.volumeInfo.imageLinks &&
//             book.volumeInfo.pageCount > 0
//         )
//         .map(async (book: any) => {

//           const googleCoverUrl =
//             book.volumeInfo.imageLinks.extraLarge ||
//             book.volumeInfo.imageLinks.large ||
//             book.volumeInfo.imageLinks.medium ||
//             book.volumeInfo.imageLinks.small ||
//             book.volumeInfo.imageLinks.thumbnail ||
//             book.volumeInfo.imageLinks.smallThumbnail;

//           const coverUrl =
//             await getBestBookCover({
//               googleCover: googleCoverUrl,
//               industryIdentifiers:
//                 book.volumeInfo.industryIdentifiers,
//             });

//           return {
//             id: book.id,
//             title: book.volumeInfo.title,
//             author: book.volumeInfo.authors ?? [],
//             description:
//               book.volumeInfo.description ?? null,
//             coverUrl: coverUrl ?? null,
//             pageCount: book.volumeInfo.pageCount,
//             categories:
//               book.volumeInfo.categories ?? [],
//           };
//         })
//     )) ?? [];


//   /*
//   Busca estatísticas locais do banco
//   */

//   const googleIds = books.map((book) => book.id);

//   const dbBooks = await prisma.book.findMany({
//     where: {
//       id: {
//         in: googleIds,
//       },
//     },
//     include: {
//       userBooks: {
//         where: {
//           userId,
//         },
//       },
//       ratings: {
//         where: {
//           userId,
//         },
//         include: {
//           user: true,
//         },
//       },
//     },
//   });

//   const booksMap: Record<string, BookStats> = {};

//   dbBooks.forEach((dbBook: any) => {

//     const userBook =
//       dbBook.userBooks.find(
//         (ub: any) => ub.userId === userId
//       ) ?? null;

//     booksMap[dbBook.id] = {
//       avgRating: dbBook.avgRating,
//       ratingsCount: dbBook.ratingsCount,
//       ratingsSum: dbBook.ratingsSum,
//       ratings: dbBook.ratings,
//       userBookInfo: {
//         status: userBook?.status,
//         isFavorite: userBook?.isFavorite,
//         rated: userBook?.rated,
//       },
//     };
//   });


//   /*
//   Detecta autor dominante automaticamente
//   */

//   const dominantAuthor =
//     getDominantAuthor(books, searchTerm);

//     console.log(dominantAuthor)

//   /*
//   Enriquecimento final + ranking inteligente
//   */

//   const rankedBooks = books
//     .map((book) => {

//       const stats = booksMap[book.id];

//       return {
//         ...book,
//         ratings: stats?.ratings ?? [],
//         avgRating: stats?.avgRating ?? 0,
//         ratingsCount: stats?.ratingsCount ?? 0,
//         ratingsSum: stats?.ratingsSum ?? 0,
//         userBookInfo:
//           stats?.userBookInfo ?? null,
//         score: scoreBook(
//           book,
//           stats,
//           searchTerm,
//           dominantAuthor ?? ''
//         ),
//       };
//     })
//     .sort((a, b) => b.score - a.score);


//   return rankedBooks;
// }
