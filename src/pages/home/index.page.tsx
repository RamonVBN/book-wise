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
import { BookProps, HomeDataResponse, PopularBook, RatingProps } from "@/@types/query-types"
import Layout from "@/components/Layout"
import { formatBookName } from "@/utils/formatBookName"
import { StarRating } from "@/components/StarsRating"

import { NextSeo } from "next-seo"
import { Fallback } from "@/components/Fallback"
import { RatingDescription } from "@/components/RatingDescription"

export default function Home(){

    const session = useSession()

    const {data: homeData, isLoading: isLoadingHomeData} = useQuery<HomeDataResponse>({
        queryKey: ['ratings'],
        queryFn: async () => {

           const response = await api.get('/app/home')

           return response.data
        }
    })

    // const userEmail = session.data?.user.email

    const isSigned = session.status  === 'authenticated'

    return (
    <>  
    <NextSeo
    title="Home | BookWise"
    description="Veja as avaliações e os livros mais populares!"
    />
    <Layout>
        <Container>               
            {
                !isLoadingHomeData ? (
            <>
                <PageHeader>
                    <ChartLineUp/>
                    <h1>Início</h1>
                </PageHeader>  
                <HomeContainer>
                    
                    <ContentContainer>
                        {
                            isSigned && homeData?.lastUserReading && (
                        <LastReadContainer>
                            <LastReadHeader>
                                <span>Sua última leitura</span>
                                <LinkButton prefetch href={'/profile'} >
                                    Ver todas
                                    <CaretRight/>
                                </LinkButton>
                            </LastReadHeader>
                            <LastReadBody prefetch href={'/profile'} >
                                <img src={homeData.lastUserReading.book.coverUrl} alt="" />
                                <LastReadContent>
                                    <div>
                                        <div>
                                            <span>{capitalize(formatDistanceToNow(homeData.lastUserReading.createdAt, {locale: ptBR, addSuffix: true}))}</span>
                                            <span>
                                                <StarRating param={homeData.lastUserReading.rate}/>   
                                            </span>
                                        </div>
                                        <div>
                                            <h2>{homeData.lastUserReading.book.title}</h2>
                                            <span>{homeData.lastUserReading.book.author}</span>
                                        </div>
                                    </div>
                                    <p>
                                    {
                                        homeData.lastUserReading.review.split(' ').length > 40 ? (

                                            homeData.lastUserReading.review.split(' ').slice(0, 40).join(' ').concat('...')
                                        )
                                        :
                                        homeData.lastUserReading.review
                                    }
                                    </p>
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
                            homeData && homeData.recentRatings && homeData.recentRatings.toReversed().map((rating, i) => {
                            return (
                        <BookRating key={rating.id}>
                                <BookRatingUserContainer>
                                    <BookRatingUser>
                                        <img src={rating.user.avatarUrl} alt="" />
                                        <span>
                                            <span>{rating.user.name}</span>
                                            <span>{capitalize(formatDistanceToNow(rating.createdAt, {locale: ptBR, addSuffix: true}))}</span>
                                        </span>
                                    </BookRatingUser>
                                    <Rating>
                                        <StarRating param={rating.rate}/>
                                    </Rating>
                                </BookRatingUserContainer>
                            <BookRatingBody>
                                <img src={rating.book.coverUrl} alt="" />
                                <BookRatingDescription>
                                    <span>
                                        <h2>{rating.book.title}</h2>
                                        <span>{rating.book.author}</span>
                                    </span>
                                    <RatingDescription description={rating.review}/>
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

                            homeData && homeData.popularBooks && homeData.popularBooks.map((book) => {

                                const bookMediaRating = calcMediaRating(book.ratings)

                                return (
                                    <PopBook key={book.id}>
                                    <img src={book.coverUrl} alt="" />
                                    <PopBookDescription>
                                        <span>
                                            <h2>{formatBookName(book.title)}</h2>
                                            <span>{book.authors}</span>
                                        </span>
            
                                        <Rating>  
                                            <StarRating param={bookMediaRating}/>
                                        </Rating>
                                    </PopBookDescription>
                                </PopBook>
                                )
                            })
                

                        }
                        </PopBookBody>     
                    </PopBookContainer>
                </HomeContainer>
            </>
                )
                :
                (
                    <Fallback/>
                )
             }    
            
        </Container>
    </Layout>
    </> 
    )
}