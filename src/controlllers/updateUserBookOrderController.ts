import { authOptions } from "@/pages/api/auth/[...nextauth].api";
import updateUserBookOrder from "@/services/updateUserBookOrder";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function updateUserBookOrderController(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const querySchema = z.object({
    userId: z.string()
  })

  const { userId } = querySchema.parse(req.query)

  if (userId !== session.user.id) {
    res.status(401).json({
      message: 'You cannot change other user books order'
    })
  }

  const bodySchema = z.object({
    userBookList: z.array(
      z.object({
        id: z.string(),
        position: z.number(),
      }),
    ),
    listType: z.enum(["favoriteBooks", "wantToReadBooks"]),
  });

  const { listType, userBookList } = bodySchema.parse(req.body);

  try {
    await updateUserBookOrder({ listType, userBookList });
  } catch (error) {
    return res.status(500).json({});
  }

  return res.status(200).json({});
}
