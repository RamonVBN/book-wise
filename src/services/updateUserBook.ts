import { ReadingStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { translateList } from "@/utils/translateList";

type UpdateUserBookProps = {
  userId: string;
  bookId: string;

  readStatus?: ReadingStatus;
  isFavorite?: boolean;
  currentPage?: number;
  customTotalPage?: number

  title: string;
  coverUrl: string;
  author: string;
  pageCount: number;
  categories: string;
};

export default async function updateUserBook({
  userId,
  bookId,
  author,
  categories,
  coverUrl,
  pageCount,
  title,
  readStatus,
  currentPage,
  isFavorite,
  customTotalPage
}: UpdateUserBookProps) {
  return prisma.$transaction(async (tx) => {

    const translatedCategories = await translateList(categories.split(','))

    const book = await tx.book.upsert({
      where: {
        id: bookId,
      },
      create: {
        id: bookId,
        title,
        coverUrl,
        author,
        pageCount,
        categories: translatedCategories.join(',') ?? categories,
      },
      update: {},
    });

    const userBook = await prisma.userBook.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    if (!userBook) {
      await tx.userBook.create({
        data: {
          userId,
          bookId: book.id,
          status: readStatus,
          isFavorite,
          currentPage:
            readStatus === "FINISHED" ? book.pageCount : (currentPage ?? 0),
        },
      });

      return;
    }

    const totalPages = customTotalPage ? customTotalPage : (userBook.customTotalPage ?? book.pageCount)
    
    await tx.userBook.update({
      where: {
        userId_bookId: {
          userId,
          bookId: book.id,
        },
      },
      data: {
        status:
          totalPages === currentPage
            ? "FINISHED"
            : (readStatus ?? userBook.status),
        isFavorite,
        currentPage: currentPage ?? (readStatus === 'FINISHED' ? totalPages : userBook.currentPage),
        customTotalPage
      },
    });

    return;
  });
}
