import { prisma } from "@/lib/prisma";

type CreateRatingProps = {
    userId: string
    bookId: string
    rate: number
    review: string
    title: string
    coverUrl: string
    author: string
    pageCount: number
    categories: string
}

export default async function createRatings(
    {userId, bookId, rate, review, author, coverUrl, pageCount, title, categories
}: CreateRatingProps){

    const isBookExists = await prisma.book.findUnique({
        where: {
            id: bookId
        }
    })

    if (!isBookExists) {

        await prisma.book.create({
            data: {
                id: bookId,
                author,
                coverUrl,
                pageCount,
                title,
                categories
            }
        })

    }

    await prisma.rating.create({
        data: {
           rate, 
           review,
           userId,
           bookId,
        }
    })

    return
}