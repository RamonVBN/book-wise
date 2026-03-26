import { prisma } from "@/lib/prisma";

type GetUserRatingProps = {
  userId: string
}

export async function getUserRatings({ userId}: GetUserRatingProps) {

  const ratings = await prisma.rating.findMany({
    where: {
      ...(userId && { userId }),
    },
    include: {
      book: true,
      user: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })

}