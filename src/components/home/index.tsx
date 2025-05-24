import { CaretRight, ChartLineUp, Star } from "phosphor-react"
import { BookRating, BookRatingBody, BookRatingDescription, BookRatingUserContainer, BookRatingUser, BooksRatingsContainer, Container, HomeContainer, LastReadBody, LastReadContainer, LastReadContent, LastReadHeader, PopBookContainer, PopBookBody, PopBook, PopBookDescription, Rating, ContentContainer, BooksRatingsContainerHeader } from "./styles"
import { books } from "../../../prisma/seeds/constants/books"
import { BooksProps, RatingProps } from "@/pages/app"
import { PageHeader } from "../pageHeader"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale/pt-BR"
import { capitalize } from "@/utils/capitalize"


type HomeProps = {
    ratings: RatingProps[] | undefined
    handleNavigation: (buttonName: string) => void
    isSigned: boolean
    userEmail?: string
    top4PopBooks: BooksProps[] | undefined
}

export default function Home({ratings, handleNavigation, isSigned, userEmail, top4PopBooks}: HomeProps){


    const userRatings = ratings?.filter((rating) => rating.user.email === userEmail)

    const lastUserRating: RatingProps | null = userRatings? userRatings.toReversed()[0] : null

    return (
    <Container>
            <PageHeader>
                <ChartLineUp/>
                <h1>Início</h1>
            </PageHeader>   
        <HomeContainer>
            
            <ContentContainer>
                {
                    isSigned && userRatings && lastUserRating && (
                <LastReadContainer>
                    <LastReadHeader>
                        <span>Sua última leitura</span>
                        <button name="profile" onClick={(e) => handleNavigation(e.currentTarget.name)}>
                            Ver todas
                            <CaretRight/>
                        </button>
                    </LastReadHeader>
                    <LastReadBody>
                        <img src={lastUserRating.book.coverUrl} alt="" />
                        <LastReadContent>
                            <div>
                                <div>
                                    <span>{capitalize(formatDistanceToNow(lastUserRating.createdAt, {locale: ptBR, addSuffix: true}))}</span>
                                    <span>
                                        {
                                            Array.from({length: 5}).map((_, i) => {

                                                if (i + 1 > lastUserRating.rate) {
                                                    
                                                    return (
                                                        <Star key={i}/>
                                                    )
                                                }

                                                return <Star key={i} weight="fill"/>
                                            })
                                        }
                                    </span>
                                </div>
                                <div>
                                    <h2>{lastUserRating.book.name}</h2>
                                    <span>{lastUserRating.book.author}</span>
                                </div>
                            </div>
                            <p>{lastUserRating.description}</p>
                        </LastReadContent>
                    </LastReadBody>
                </LastReadContainer>
                    )
                }

                <BooksRatingsContainer>
                    <BooksRatingsContainerHeader>
                        Avaliações mais recentes
                    </BooksRatingsContainerHeader>

                {
                    ratings && ratings.toReversed().map((rating, i) => {
                    return (
                    <BookRating key={i}>
                        <BookRatingUserContainer>
                            <BookRatingUser>
                                <img src={rating.user.avatarUrl} alt="" />
                                <span>
                                    <span>{rating.user.name}</span>
                                    <span>{capitalize(formatDistanceToNow(rating.createdAt, {locale: ptBR, addSuffix: true}))}</span>
                                </span>
                            </BookRatingUser>
                            <Rating>
                                {
                                Array.from({length: 5}).map((_,i) => {
                                    if (i + 1 > rating.rate) {
                                        return <Star key={i}/>
                                    }
                
                                    return (
                                        <Star key={i} weight="fill"/>
                                    )
                                })
                                }
                            </Rating>
                        </BookRatingUserContainer>
                    <BookRatingBody>
                        <img src={rating.book.coverUrl} alt="" />
                        <BookRatingDescription>
                            <span>
                                <h2>{rating.book.name}</h2>
                                <span>{rating.book.author}</span>
                            </span>
                            <p>{rating.description}</p>
                        </BookRatingDescription>
                    </BookRatingBody>
                </BookRating>
                    )
                })
                }
                
                </BooksRatingsContainer>
            </ContentContainer>

                        
            <PopBookContainer>
                    <span>
                    <span>Livros populares</span>
                    <button onClick={(e) => handleNavigation(e.currentTarget.name)} name="explore">
                    Ver todos
                    <CaretRight weight="bold"/>
                    </button>

                    </span>
                <PopBookBody>
                   {
                    top4PopBooks && top4PopBooks.map((book) => {
                        const bookRatingAmount = book.ratings.reduce((accumulator, currentValue) => {
                            return accumulator += currentValue.rate
                        }, 0)

                        const bookMediaRating = bookRatingAmount / book.ratings.length

                        return (
                            <PopBook>
                            <img src={book.coverUrl} alt="" />
                            <PopBookDescription>
                                <span>
                                    <h2>{book.name}</h2>
                                    <span>{book.author}</span>
                                </span>
    
                                <Rating>
                                   {
                                        Array.from({length: 5}).map((_, i) => {
                                            
                                            if (i + 1 > bookMediaRating) {
                                                
                                                return (
                                                    <Star key={i}/>
                                                )
                                            }

                                            return <Star key={i} weight="fill"/>
                                        })
                                   }
                                </Rating>
                            </PopBookDescription>
                        </PopBook>
                        )
                    })
                   }
                </PopBookBody>     
            </PopBookContainer>
        </HomeContainer>
    </Container>
    )
}