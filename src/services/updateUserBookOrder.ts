import { prisma } from "@/lib/prisma";

type UpdateUserBookOrderProps = {
  userBookList: {
    id: string;
    position: number;
  }[];
  listType: "favoriteBooks" | "wantToReadBooks";
};

export default async function updateUserBookOrder({
  userBookList,
  listType,
}: UpdateUserBookOrderProps) {
  return prisma.$transaction(async (tx) => {
    const column =
      listType === "favoriteBooks"
        ? "favorite_position"
        : "want_to_read_position";

    for (const { id, position } of userBookList) {
      await tx.$executeRawUnsafe(
        `UPDATE "user_books"
         SET "${column}" = $1
         WHERE "id" = $2`,
        position,
        id
      );
    }
  });
}