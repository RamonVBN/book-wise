import { prisma } from "@/lib/prisma";

type DeleteRatingProps = {
  userId: string;
  ratingId: string;
  bookId: string;
  rate: number;
};

export default async function deleteRating({
  userId,
  ratingId,
  bookId,
  rate,
}: DeleteRatingProps) {
  await prisma.rating.delete({
    where: {
      id: ratingId,
      user: {
        id: userId,
      },
    },
  });

  await prisma.$queryRaw`
  UPDATE "user_books"
  SET "rated" = false
  WHERE "user_id" = ${userId}
    AND "book_id" = ${bookId};
`;

  const book = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
    include: {
      ratings: true,
    },
  });

  if (book!.ratings.length < 1) {
    await prisma.book.update({
      where: {
        id: bookId,
      },
      data: {
        ratingsCount: 0,
        ratingsSum: 0,
        avgRating: 0,
      },
    });
  } else {
    const newRatingsCount = book!.ratingsCount - 1;
    const newRatingsSum = book!.ratingsSum - rate;
    const newAvg = newRatingsSum / newRatingsCount;

    await prisma.book.update({
      where: {
        id: bookId,
      },
      data: {
        ratingsCount: newRatingsCount,
        ratingsSum: newRatingsSum,
        avgRating: newAvg,
      },
    });
  }

  return;
}
