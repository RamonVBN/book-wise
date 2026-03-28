// Query Types

import { ReadingStatus } from "@/generated/prisma"

type RatingBookProps = {
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
    book: BookProps
    user: RatingUserProps
    createdAt: string
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
    finished: boolean
}

export type UserBookProps = {
    id: string
    userId: string
    status: ReadingStatus
    isFavorite: boolean
    currentPage?: number
    book: BookProps
}

export type HomeDataResponse = {
    recentRatings: RatingProps[]
    popularBooks: BookProps[]
    lastUserReading: RatingProps | null
}

export type BooksResponse = {
  items: ExploreBooksProps[]
  total: number
}

export type BookStats = {

  avgRating: number
  ratingsCount: number
  ratingsSum: number
  finished: boolean
}
 
type Category = {
    category: {
        name: string
    }
}

export type ProfileResponse = {
    userRatings: RatingProps[],
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
  } | null
}

