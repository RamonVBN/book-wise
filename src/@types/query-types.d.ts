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

export type BooksProps = {

    id: string
    name: string
    author: string
    coverUrl: string
    totalPages: number,
    categories: Category[]
    ratings: {
        rate: number
        createdAt: string
        description: string
        user: {
            avatarUrl: string
            name: string
            email: string
        }
    }[]
}

type Category = {
    category: {
        name: string
    }
}

export type AllCategories = {
    name: string
}[]