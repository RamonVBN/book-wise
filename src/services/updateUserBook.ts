import { ReadingStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

type UpdateUserBookProps = {
    userId: string
    bookId: string

    readStatus?:  ReadingStatus
    isFavorite?: boolean, 
    currentPage?: number,

    title: string
    coverUrl: string
    author: string
    pageCount: number
    categories: string
}

export default async function updateUserBook(
    {userId, bookId, author, categories, coverUrl, pageCount, title, readStatus, currentPage, isFavorite
}: UpdateUserBookProps){

    return prisma.$transaction(async (tx) => {

    const book = await tx.book.upsert({
        where: {
            id: bookId
        },
        create: {
            id: bookId,
            title,
            coverUrl,
            author,
            pageCount,
            categories  
        },
        update: {}
    })

    const userBook = await prisma.userBook.findUnique({
        where: {
            userId_bookId: {
                userId,
                bookId
            }
        }
    })

    if (!userBook) {
        await tx.userBook.create({
            data: {
                userId,
                bookId: book.id,
                status: readStatus,
                isFavorite,
                currentPage:  readStatus === 'FINISHED' ? book.pageCount : currentPage ?? 0
            }
        })

        return
    }

    await tx.userBook.update({
        where: {
            userId_bookId: {
                userId,
                bookId: book.id
            }
        },
        data: {
            status: book.pageCount === currentPage ? 'FINISHED' : readStatus ?? userBook.status,
            isFavorite,
            currentPage:  currentPage ?? userBook.currentPage
        }
    })

    return
})}