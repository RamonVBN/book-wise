
type Ratings = {
    rate: number
        createdAt: string
        description: string
        user: {
            avatarUrl: string
            name: string
        }
}

export function calcMediaRating(ratings: Ratings[]){

   const sum = ratings.reduce((accumulator, currentValue) => {
        return accumulator += currentValue.rate
    }, 0)

    return sum / ratings.length
}