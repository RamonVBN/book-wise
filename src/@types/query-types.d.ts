
// Query Types

import { ReadingStatus } from "@/generated/prisma"

type RatingBookProps = {
    id: string
    author: string
    title: string
    coverUrl: string
    pageCount: number
    categories: string
}

type RatingUserProps = {
    id: string
    name: string
    avatarUrl: string
    email: string
}

export type RatingProps = {
    id: string
    rate : number
    review: string
    book: RatingBookProps
    user: RatingUserProps
    createdAt: string
    updatedAt: string
}

export type BookProps = {
    id: string
    title: string
    description: string
    author: string
    categories: string
    pageCount: number
    coverUrl: string 
    avgRating: number
    ratingsCount: number
    ratingsSum: number
    ratings: RatingProps[]
}

export interface ExploreBooksProps extends BookProps {
    author: string[]
    categories: string[]
    userBookStatus: ReadingStatus | null
}

export type UserBookProps = {
    id: string
    userId: string
    status: ReadingStatus
    isFavorite: boolean
    rated: boolean
    currentPage?: number
    customTotalPage?: number
    updatedAt: string
    book: BookProps
    user: RatingUserProps
}

export type HomeDataResponse = {
    recentRatings: RatingProps[]
    popularBooks: BookProps[]
    lastUserActivity: RatingProps | UserBookProps | null
}

export type BooksResponse = {
  items: ExploreBooksProps[]
  total: number
}

export type BookStats = {

  avgRating: number
  ratingsCount: number
  ratingsSum: number
  userBookStatus: ReadingStatus | null
}
 
type Category = {
    category: {
        name: string
    }
}

export type ProfileResponse = {
    userRatings: RatingProps[],
    allUserBooks: UserBookProps[],
    currentlyReadingBooks: UserBookProps[],
    finishedBooks: UserBookProps[],
    abandonedBooks: UserBookProps[],
    wantToReadBooks: UserBookProps[],
    favoriteBooks: UserBookProps[],
}

type BooksQueryData = {
  pages: {
    items: BookProps[]
  }[]
}

type RatingQueryData = {
  ratings: RatingProps[]
  userStatus: {
    status: ReadingStatus
    isFavorite: boolean
    rated: boolean
  } | null
}

