// Query Types

type RatingBookProps = {
    author: string
    title: string
    coverUrl: string
    pageCount: number
    categories: string
}

type RatingUserProps = {
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
}

export type BookProps = {
    id: string
    title: string
    description: string
    authors: string[]
    categories: string[]
    pageCount: number
    coverUrl: string 
    ratings: RatingProps[]
}

export type GoogleBookProps = {
    id: string
    title: string
    description: string
    authors: string[]
    categories: string[]
    pageCount: number
    thumbnail: string 
    ratings: RatingProps[]
}

export interface PopularBook extends BookProps {
  _count: {
    ratings: number
  }
}

export type HomeDataResponse = {
    recentRatings: RatingProps[]
    popularBooks: PopularBook[]
    lastUserReading: RatingProps | null
}

export type BooksResponse = {
  items: GoogleBookProps[]
  total: number
}
 
type Category = {
    category: {
        name: string
    }
}

export type AllCategories = {
    name: string
}[]