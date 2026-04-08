import { authOptions } from "@/pages/api/auth/[...nextauth].api";
import createRating from "@/services/createRating";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function createRatingController(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const bodySchema = z.object({
    bookId: z.string(),
    rate: z.number(),
    review: z.string(),
    title: z.string(),
    author: z.string(),
    coverUrl: z.string(),
    pageCount: z.number(),
    categories: z.string(),
  });

  const {
    bookId,
    rate,
    review,
    author,
    coverUrl,
    pageCount,
    title,
    categories,
  } = bodySchema.parse(req.body);

    await createRating({
      userId: session.user.id,
      bookId,
      rate,
      review,
      author,
      coverUrl,
      pageCount,
      title,
      categories,
    });

    return res.status(201).json({});
}
