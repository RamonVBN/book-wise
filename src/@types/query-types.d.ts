// Query Types

type RatingBookProps = {
    author: string
    name: string
    coverUrl: string,
    summary: string
}

type RatingUserProps = {
    name: string
    avatarUrl: string
    email: string
}

export type RatingProps = {
    id: string
    rate : number
    description: string
    createdAt: string
    book: RatingBookProps
    user: RatingUserProps

}


export type BookProps = {
    id: string
    title: string
    description: string
    authors: string[]
    categories: string[]
    pageCount: number
    thumbnail: string 
}

export type BooksResponse = {
  items: BookProps[]
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