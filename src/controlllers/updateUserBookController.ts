import { authOptions } from "@/pages/api/auth/[...nextauth].api";
import updateUserBook from "@/services/updateUserBook";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function updateUserBookController(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const querySchema = z.object({
    id: z.string(),
  });

  const { id } = querySchema.parse(req.query);

  if (session.user.id !== id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const bodySchema = z
    .object({
      isFavorite: z.boolean().optional(),
      currentPage: z.number().optional(),
      customTotalPage: z.number().optional(),
      readStatus: z
        .enum(["WANT_TO_READ", "READING", "FINISHED", "ABANDONED"])
        .optional(),

      bookId: z.string(),
      title: z.string(),
      author: z.string(),
      coverUrl: z.string(),
      pageCount: z.number(),
      categories: z.string(),
    })
    .superRefine((data, ctx) => {
      const filledFields = [
        data.currentPage !== undefined,
        data.readStatus !== undefined,
        data.isFavorite !== undefined,
      ].filter(Boolean).length;

      if (filledFields === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Envie exatamente um desses campos para atualização [currentPage, readStatus, isFavorite]",
          path: [],
        });
      }

      if (filledFields > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Apenas um desses campos pode ser atualizado por vez [currentPage, readStatus, isFavorite]",
          path: [],
        });
      }
    });

  const {
    bookId,
    author,
    coverUrl,
    pageCount,
    title,
    categories,
    readStatus,
    isFavorite,
    currentPage,
    customTotalPage,
  } = bodySchema.parse(req.body);

  if ((currentPage && customTotalPage) && currentPage > customTotalPage) {
    return res.status(400).json({
      message: "Current page cannot be higher than total page.",
    });
  }

   if (customTotalPage && (customTotalPage < 1 || customTotalPage > 505600)) {
    return res.status(400).json({
      message: "Invalid custom total page",
    });
  }

  await updateUserBook({
    userId: session.user.id,
    bookId,
    readStatus,
    isFavorite,
    currentPage,
    author,
    coverUrl,
    pageCount,
    title,
    categories,
    customTotalPage,
  });

  return res.status(200).json({});
}
