import { CaretRight, ChartLineUp, Star, StarHalf } from "phosphor-react"
import { BookRating, BookRatingBody, BookRatingDescription, BookRatingUserContainer, BookRatingUser, BooksRatingsContainer, Container, HomeContainer, LastReadBody, LastReadContainer, LastReadContent, LastReadHeader, PopBookContainer, PopBookBody, PopBook, PopBookDescription, Rating, ContentContainer, BooksRatingsContainerHeader, LinkButton } from "./styles"

import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale/pt-BR"
import { capitalize } from "@/utils/capitalize"
import { PageHeader } from "@/components/pageHeader"
import { calcMediaRating } from "@/utils/calcMediaRating"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { useSession } from "next-auth/react"
import { BooksProps, RatingProps } from "@/@types/query-types"
import Layout from "@/components/Layout"
import { formatBookName } from "@/utils/formatBookName"
import { StarRating } from "@/components/StarsRating"


export default function Home(){

    const session = useSession()


    const {data: ratingData} = useQuery<{ratings: RatingProps[]}>({
        queryKey: ['ratings'],
        queryFn: async () => {

           const response = await api.get('/app/users/ratings')

           return response.data
        }
    })

    const {data: booksData} = useQuery<{books: BooksProps[]}>({
    
        queryKey: ['books'],
        queryFn: async () => {

            const response = await api.get('/app/books')

            return response.data
        },
            
    })

    const userEmail = session.data?.user.email

    const isSigned = session.status  === 'authenticated'

    const top4PopBooks = booksData?.books.slice(0, 4)

    const userRatings = ratingData?.ratings?.filter((rating) => rating.user.email === userEmail)

    const lastUserRating: RatingProps | null = userRatings? userRatings.toReversed()[0] : null

    return (
    <Layout>
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
                            <LinkButton prefetch href={'/profile'} >
                                Ver todas
                                <CaretRight/>
                            </LinkButton>
                        </LastReadHeader>
                        <LastReadBody prefetch href={'/profile'} >
                            <img src={lastUserRating.book.coverUrl} alt="" />
                            <LastReadContent>
                                <div>
                                    <div>
                                        <span>{capitalize(formatDistanceToNow(lastUserRating.createdAt, {locale: ptBR, addSuffix: true}))}</span>
                                        <span>
                                            {

                                                <StarRating param={lastUserRating.rate}/>

                                                // Array.from({length: 5}).map((_, i) => {

                                                //     if (i + 1 > lastUserRating.rate) {
                                                        
                                                //         return (
                                                //             <Star key={i}/>
                                                //         )
                                                //     }

                                                //     return <Star key={i} weight="fill"/>
                                                // })
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
                        ratingData?.ratings && ratingData.ratings.toReversed().map((rating, i) => {
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
                                        <StarRating param={rating.rate}/>

                                        // Array.from({length: 5}).map((_,i) => {
                                        //     if (i + 1 > rating.rate) {
                                        //         return <Star key={i}/>
                                        //     }
                        
                                        //     return (
                                        //         <Star key={i} weight="fill"/>
                                        //     )
                                        // })
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
                        <LinkButton prefetch href={'/explore'}>
                        Ver todos
                        <CaretRight weight="bold"/>
                        </LinkButton>

                        </span>
                    <PopBookBody>
                    {
                        top4PopBooks && top4PopBooks.map((book, i) => {

                            const bookMediaRating = calcMediaRating(book.ratings)

                            return (
                                <PopBook key={i}>
                                <img src={book.coverUrl} alt="" />
                                <PopBookDescription>
                                    <span>
                                        <h2>{formatBookName(book.name)}</h2>
                                        <span>{book.author}</span>
                                    </span>
        
                                    <Rating>
                                    {
                                        
                                        <StarRating param={bookMediaRating}/>
                                        //    Array.from({length: 5}).map((_, i) => {
                                                
                                        //     if ((bookMediaRating - ((i + 1) - 1)) > 0 && (bookMediaRating - ((i + 1) - 1)) < 1 ) {
                                        //         return (
                                        //             <StarHalf key={i} weight="fill"/>  
                                        //         )
                                        //     }
                                            
                                        //     if (i + 1 > bookMediaRating) {

                                                
                                        //         return (
                                        //             <Star key={i}/>
                                        //         )
                                        //     }

                                        //     return <Star key={i} weight="fill"/>
                                        // })
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
    </Layout>
    )
}