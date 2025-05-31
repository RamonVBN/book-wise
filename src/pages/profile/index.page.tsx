import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ProfileButton,  ProfileMainContainer, ProfileForm, ProfileInput, UserSeparator, UserStats, UserStatsContainer,  RatedBook, RatedBookInfo, RatedBooksContainer, RatedBookTime, UserContainer, UserProfile, Container, ProfileContainer } from "./styles"
import { BookmarkSimple, BookOpen, Books, MagnifyingGlass, Star, User, UserList } from "phosphor-react"
import { formatDistanceToNow, getYear } from "date-fns"
import { ptBR } from "date-fns/locale/pt-BR"
import { capitalize } from "@/utils/capitalize"
import { PageHeader } from "@/components/pageHeader"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { useSession } from "next-auth/react"
import Layout from "@/components/Layout"
import { BooksProps, RatingProps } from "@/@types/query-types"
import { formatCategories } from "@/utils/formatCategories"
import { StarRating } from "@/components/StarsRating"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"
import { Fallback } from "@/components/Fallback"

const profileFormSchema = z.object({
    RatedBook: z.string().min(1)
})

type ProfileFormData = z.infer<typeof profileFormSchema>

type MostReadCategory = {
    categoryName: string
    count: number
}

export default function Profile(){

    const session = useSession()

    const router = useRouter()

    const {register, handleSubmit, setFocus, reset, watch} = useForm<ProfileFormData>()
    
    function onSubmit(){
        
        reset()
        setFocus('RatedBook')
    }

    async function handlePossibleRedirectForConsistency(){
        await router.push('/')
    }

    const {data: ratingData, isLoading: isLoadingRatings} = useQuery<{ratings: RatingProps[]}>({
        queryKey: ['ratings'],
        queryFn: async () => {

           const response = await api.get('/app/users/ratings')

           return response.data
        }
    })

    const {data: booksData, isLoading: isLoadingBooks} = useQuery<{books: BooksProps[]}>({

        queryKey: ['books'],
        queryFn: async () => {

            const response = await api.get('/app/books')

            return response.data
        },
        
    })

    const userEmail = session.data?.user.email
    const userName = session.data?.user.name
    const avatarUrl = session.data?.user.avatarUrl
    const createdAt = session.data?.user.created_at

    const userRatings = ratingData?.ratings.toReversed().filter((rating) => rating.user.email === userEmail)

    const profileRatings = userRatings ? userRatings.filter((rating) => 
        rating.book.name.toLowerCase().trim().includes(watch('RatedBook') ? watch('RatedBook').trim().toLowerCase(): '') ) : []

    const userRatedBooks = booksData?.books.filter((book) => {
        
        return userRatings?.some((rating) => rating.book.name === book.name)
    })
    
    const userTotalPages = userRatedBooks?.reduce((acc, current) => {
        return acc += current.totalPages
    }, 0)

    const userTotalAuthors = userRatedBooks?.map((ratedBook) => {
        
        return ratedBook.author

    }).reduce((acc: string[], current): string[] => {

        if (acc.includes(current)) {

            return acc
        }
        
        acc.push(current)
        return acc
    }, [])

    const MostReadCategories = userRatedBooks?.reduce((acc: MostReadCategory[], current): MostReadCategory[] => {

        current.categories.map((category) => {

            if (acc.some((item) => item.categoryName === category.category.name)) {
                
                const index = acc.findIndex((item) => item.categoryName === category.category.name)
                
                acc[index].count += 1

            }else {

                acc.push({
                    categoryName: category.category.name,
                    count: 1
                })
            }
        })

        return acc
        
    }, []).reduce((acc:MostReadCategory[], current, index): MostReadCategory[] => {

        if (index !== 0) {
            
            if (acc.every((category) => category.count < current.count)) {
                
                acc = []
                
                acc.push(current)

            }else if (acc.every((category) => category.count === current.count)) {
                
                acc.push(current)

            }

            
        } else {

            acc.push(current)
        }


        return acc

    }, [])


    if (session.status === 'unauthenticated') {
        
        handlePossibleRedirectForConsistency()
    }

    return(
    <>
    <NextSeo
    title="Profile | BookWise"
    description="Veja suas leituras e metas pessoais!"
    />
    <Layout>
        <Container>
               {
                !isLoadingBooks || !isLoadingRatings? (
                    <>
                         <PageHeader>
                    <User/>
                    <h1>Perfil</h1>
                </PageHeader>
            <ProfileContainer>
                <ProfileMainContainer>
                <ProfileForm onSubmit={handleSubmit(onSubmit)}>
                <label >
                    <ProfileInput {...register('RatedBook')} placeholder="Buscar livro avaliado" />
                </label>
                <ProfileButton>
                    <MagnifyingGlass/>
                </ProfileButton>
                </ProfileForm>
            
                <RatedBooksContainer>
                    
                    {
                        profileRatings && profileRatings.map((profileRating, i) => {

                            return (
                                <div key={i}>
                                <RatedBookTime>{capitalize(formatDistanceToNow(profileRating.createdAt, {addSuffix: true, locale: ptBR}))}
                                    </RatedBookTime>
                                <RatedBook>
                                    <RatedBookInfo>
                                        <img src={profileRating.book.coverUrl} alt="" />
                                        <div>
                                            <span>
                                            <h2>{profileRating.book.name}</h2>
                                            <span>{profileRating.book.author}</span>
                                            </span>
                                            
                                            <span>
                                            {

                                                <StarRating param={profileRating.rate}/>

                                                // Array.from({length: 5}).map((_,i) => {
                                                    
                                                //     if (i + 1 > profileRating.rate) {
                                                        
                                                //         return (
                                                //         <Star key={i} />
                                                //     )
                                                //     }
                    
                                                //     return (
                                                //         <Star key={i} weight="fill"/>
                                                //     )
                                                // })
                                            }
                                            </span>
                                        </div>
                                    </RatedBookInfo>
                    
                                    <p>{profileRating.book.summary}</p>
                                </RatedBook>
                                </div> 
                            )
                        })
                    }
                </RatedBooksContainer>
                </ProfileMainContainer>

                <UserContainer>
                            <UserProfile>
                                <img src={avatarUrl} alt="" />
                                <span>
                                    <h2>{userName}</h2>
                                    <span>membro desde {getYear(createdAt? createdAt: '')}</span>
                                </span>
                            </UserProfile>

                            <UserSeparator/>

                            <UserStatsContainer>
                                <UserStats>
                                <BookOpen/>
                                    <span>
                                        <h3>{userTotalPages}</h3>
                                        <span>Páginas lidas</span>
                                    </span>
                                </UserStats>

                                <UserStats>
                                    <Books />
                                    <span>
                                        <h3>{userRatedBooks?.length}</h3>
                                        <span>Livros avaliados</span>
                                    </span>
                                </UserStats>

                                <UserStats>
                                <UserList/>
                                    <span>
                                        <h3>{userTotalAuthors?.length}</h3>
                                        <span>Autores lidos</span>
                                    </span>
                                </UserStats>

                                <UserStats>
                                    <BookmarkSimple/>
                                    <span>
                                        <h3>
                                            {
                                                MostReadCategories?.map((category, i) => {

                                                    return (
                                                        formatCategories(category.categoryName, i)
                                                    )
                                                })
                                            }
                                        </h3>
                                        <span>Categoria(s) mais lida(s)</span>
                                    </span>
                                </UserStats>
                            </UserStatsContainer>
                </UserContainer>

            </ProfileContainer>
            </>
                ): (<Fallback/>)

               }
        </Container>
    </Layout>
    </>
    )
}