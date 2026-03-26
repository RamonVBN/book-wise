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


    await tx.userBook.upsert({
        where: {
            userId_bookId: {
                userId,
                bookId: book.id
            }
        },
        create: {
            userId,
            bookId: book.id,
            status: readStatus,
            isFavorite,
            currentPage: readStatus === 'FINISHED' ? book.pageCount : null
        },
        update: {
            status: readStatus,
            isFavorite,
            currentPage: readStatus === 'FINISHED' ? book.pageCount : null
        }
    })
})}