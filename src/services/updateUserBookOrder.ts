import { prisma } from "@/lib/prisma";

type UpdateUserBookOrderProps = {
    userBookList: {
        id: string
        position: number
    }[]
    listType: 'favoriteBooks' | 'wantToReadBooks'
};

export default async function updateUserBookOrder({userBookList, listType}: UpdateUserBookOrderProps) {
  return prisma.$transaction(async (tx) => {

    for (const { id, position } of userBookList) {

      await tx.userBook.update({

        where: { id },

        data:
          listType === "favoriteBooks"

            ? {
                favoritePosition: position,
              }

            : {
                wantToReadPosition: position,
              },
      })
    }
  })
}
