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
  });

  const {
    bookId,
    rate,
    review,
  } = bodySchema.parse(req.body);

  await createRating({
    userId: session.user.id,
    bookId,
    rate,
    review,
  });

  return res.status(201).json({});
}
