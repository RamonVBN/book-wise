import { prisma } from "@/lib/prisma";

type CreateRatingProps = {
    userId: string
    ratingId: string
    bookId: string,
    rate: number
}

export default async function deleteRating(
    {userId, ratingId, bookId, rate
}: CreateRatingProps){

    await prisma.rating.delete({
        where: {
            id: ratingId,
            user: {
                id: userId
            }
        }
    })

    const book = await prisma.book.findUnique({
        where: {
            id: bookId
        },
        include: {
            ratings: true
        }
    })

    if (book!.ratings.length < 1){

        await prisma.book.delete({
            where: {
                id: bookId
            }
        })
    } else {

        const newRatingsCount = book!.ratingsCount - 1
        const newRatingsSum = book!.ratingsSum - rate
        const newAvg = newRatingsSum / newRatingsCount

        await prisma.book.update({
            where: {
                id: bookId
            },
            data: {
                ratingsCount: newRatingsCount,
                ratingsSum: newRatingsSum,
                avgRating: newAvg
            } 
        })
    }

    return 
}