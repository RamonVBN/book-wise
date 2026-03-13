import { useEffect, useMemo, useState } from "react"
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
import { BookProps, RatingProps } from "@/@types/query-types"
import { formatCategories } from "@/utils/formatCategories"
import { StarRating } from "@/components/StarsRating"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"
import { Fallback } from "@/components/Fallback"
import Image from "next/image"

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

    async function handlePossibleRedirect(){
        await router.push('/')
    }

    const userId = session.data?.user.id
    const userName = session.data?.user.name
    const avatarUrl = session.data?.user.avatarUrl
    const createdAt = session.data?.user.createdAt

    const {data: ratingData, isLoading: isLoadingRatings} = useQuery<RatingProps[]>({
        queryKey: ['ratings'],
        queryFn: async () => {

           const response = await api.get(`/app/users/ratings?userId=${userId}`)

           return response.data
        },
        enabled: !!userId
    })

    const ratings = Array.isArray(ratingData) ? ratingData : []

    const ratingsByInput = ratings.filter((rating) => 
        rating.book.title.toLowerCase().trim().includes(watch('RatedBook') ? watch('RatedBook').trim().toLowerCase() : '')) 
    
    const userTotalPages = useMemo(() => {
        return ratings.reduce((acc, current) => {
            return acc + current.book.pageCount
        }, 0)
    }, [ratings])

    const userTotalAuthorsList = useMemo(() => {

        return ratings.map((rating) => {
            
            const authorsList = rating.book.author.split(',')
            
            return authorsList

        }).reduce((acc: string[], current): string[] => {
            
            current.map((author) => {

                if(acc.includes(author)) {
                    return
                } else {
                    acc.push(author)
                }  
            })

            return acc

        }, [])

    }, [ratings])

    const mostReadCategories = useMemo(() => {
        return ratings.reduce((acc: MostReadCategory[], current): MostReadCategory[] => {

            current.book.categories.split(',').map((category) => {

                if (acc.some((item) => item.categoryName === category)) {
                    
                    const index = acc.findIndex((item) => item.categoryName === category)
                    
                    acc[index].count += 1

                } else {

                    acc.push({
                        categoryName: category,
                        count: 1
                    })
                }
            })

            return acc
            
            }, []).reduce((acc: MostReadCategory[], current, index): MostReadCategory[] => {

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
    }, [ratings])

    if (session.status === 'unauthenticated') {
        
        handlePossibleRedirect()
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
                isLoadingRatings ? (<Fallback/>) : (
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
                        ratingsByInput.map((rating) => (

                            <div key={rating.id}>
                                <RatedBookTime>{capitalize(formatDistanceToNow(rating.createdAt, {addSuffix: true, locale: ptBR}))}
                                    </RatedBookTime>
                                <RatedBook>
                                    <RatedBookInfo>
                                        <Image width={98} height={134} src={rating.book.coverUrl} alt="" />
                                        <div>
                                            <span>
                                            <h2>{rating.book.title}</h2>
                                            <span>{rating.book.author}</span>
                                            </span>
                                            
                                            <span>
                                                <StarRating param={rating.rate}/>
                                            </span>
                                        </div>
                                    </RatedBookInfo>
                    
                                    <p>{rating.review}</p>
                                </RatedBook>
                                </div> 
                        ))
                    }
                </RatedBooksContainer>
                </ProfileMainContainer>

                <UserContainer>
                            <UserProfile>

                                {avatarUrl && (
                                    <Image width={72} height={72} src={avatarUrl} alt="" />
                                )
                                }

                                <span>
                                    <h2>{userName}</h2>
                                    <span>membro desde {getYear(createdAt ? createdAt: '')}</span>
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
                                        <h3>{ratingData?.length}</h3>
                                        <span>Livros avaliados</span>
                                    </span>
                                </UserStats>

                                <UserStats>
                                <UserList/>
                                    <span>
                                        <h3>{userTotalAuthorsList.length}</h3>
                                        <span>Autores lidos</span>
                                    </span>
                                </UserStats>

                                <UserStats>
                                    <BookmarkSimple/>
                                    <span>
                                        <h3>
                                            {
                                                mostReadCategories?.map((category, i) => {

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
                ) 
            }
        </Container>
    </Layout>
    </>
    )
}