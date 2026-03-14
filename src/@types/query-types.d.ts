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
    avgRating: number
    ratingsCount: number
    ratingsSum: number
    read: boolean
    ratings: RatingProps[]
}

export type HomeDataResponse = {
    recentRatings: RatingProps[]
    popularBooks: BookProps[]
    lastUserReading: RatingProps | null
}

export type BooksResponse = {
  items: BookProps[]
  total: number
}

export type BookStats = {

  avgRating: number
  ratingsCount: number
  ratingsSum: number
  read: boolean
}
 
type Category = {
    category: {
        name: string
    }
}

