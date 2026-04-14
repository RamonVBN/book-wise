import { prisma } from "@/lib/prisma";

type DeleteUserBookProps = {
    userId: string
    bookId: string
    userBookId: string
}

export default async function deleteUserBook(
    {userId, bookId, userBookId
}: DeleteUserBookProps){

    await prisma.userBook.delete({
        where: {
            id: userBookId,
            userId_bookId: {
                userId,
                bookId
            }
        }
    })

    const book = await prisma.book.findUnique({
        where: {
            id: bookId
        },
        include: {
            userBooks: true
        }
    })

    const rating = await prisma.rating.findUnique({
        where: {
            userId_bookId: {
                userId,
                bookId
            }
        }
    })

    if (rating) {

        await prisma.rating.delete({
            where: {
                id: rating.id
            }
        })
    }

    if (book!.userBooks.length < 1){

        await prisma.book.delete({
            where: {
                id: bookId
            }
        })
    } 

    return 
}