import { prisma } from "@/lib/prisma"
import { authOptions } from "@/pages/api/auth/[...nextauth].api"
import deleteUserBook from "@/services/deleteUserBook"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { z } from 'zod'

export async function deleteUserBookController(req: NextApiRequest, res: NextApiResponse) {

    const session = await getServerSession(req, res, authOptions)

    if (!session) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const querySchema = z.object({
        id: z.string(),
    })

    const { id } = querySchema.parse(req.query)

    const userBook = await prisma.userBook.findUnique({
        where: {
            id
        }
    })

    if (!userBook) {
        return res.status(404).json({ message: "User book not found" })
    }

    if (session.user.id !== userBook.userId) {
        return res.status(404).json({ message: "You cannot delete another user book" })
    } 

    await deleteUserBook({
        userBookId: id,
        userId: session.user.id,
        bookId: userBook.bookId
    })

    return res.status(200).json({})
}