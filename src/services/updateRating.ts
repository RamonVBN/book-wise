import { prisma } from "@/lib/prisma";

type UpdateRatingProps = {
    ratingId: string
    bookId: string,
    newRate: number,
    newReview: string
}

export default async function updateRating(
    {ratingId, bookId, newRate, newReview
}: UpdateRatingProps){

    const rating = await prisma.rating.findUnique({
        where: {
            id: ratingId
        }
    })

    if (!rating) {
        return
    }

    const oldRate = rating!.rate

    const book = await prisma.book.findUnique({
        where: {
            id: bookId
        }
    })

    if (!book) {
        return
    }

    const isSame = oldRate === newRate 
    
    if(!isSame) {

        const newRatingsSum = (book.ratingsSum - oldRate) + newRate
        const newAvg = newRatingsSum / book.ratingsCount

        await prisma.book.update({
            where: {
                id: bookId
            },
            data: {
                ratingsSum: newRatingsSum,
                avgRating: newAvg
            }
        })
    }
    
    await prisma.rating.update({
        where: {
            id: ratingId
        },
        data: {
            review: newReview,
            rate: newRate
        }
    })

    return 
}