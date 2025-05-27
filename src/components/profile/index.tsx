import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ProfileButton,  ProfileMainContainer, ProfileForm, ProfileInput, UserSeparator, UserStats, UserStatsContainer,  RatedBook, RatedBookInfo, RatedBooksContainer, RatedBookTime, UserContainer, UserProfile, Container, ProfileContainer } from "./styles"
import { BookmarkSimple, BookOpen, Books, MagnifyingGlass, Star, User, UserList } from "phosphor-react"
import { RatingProps } from "@/pages/app"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale/pt-BR"
import { capitalize } from "@/utils/capitalize"
import { PageHeader } from "@/components/pageHeader"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { useSession } from "next-auth/react"

const profileFormSchema = z.object({
    RatedBook: z.string().min(1)
})

type ProfileFormData = z.infer<typeof profileFormSchema>

export default function Profile(){

    const session = useSession()

    const {register, handleSubmit, setFocus, reset, watch} = useForm<ProfileFormData>()
    
    function onSubmit(){
        
        reset()
        setFocus('RatedBook')
    }

    const {data: ratingData} = useQuery<{ratings: RatingProps[]}>({
        queryKey: ['ratings'],
        queryFn: async () => {

           const response = await api.get('/app/users/ratings')

           return response.data
        }
    })

    const name = session.data?.user.name
    const avatarUrl = session.data?.user.avatarUrl

    const profileRatings = ratingData?.ratings ? ratingData.ratings.toReversed().filter((rating) => 
        rating.user.name === name && 
        rating.book.name.toLowerCase().trim().includes(watch('RatedBook') ? watch('RatedBook').trim().toLowerCase(): '') ) : []

    return(
    <Container>
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
                                            Array.from({length: 5}).map((_,i) => {
                                                
                                                if (i + 1 > profileRating.rate) {
                                                    
                                                    return (
                                                    <Star key={i} />
                                                )
                                                }
                
                                                return (
                                                    <Star key={i} weight="fill"/>
                                                )
                                            })
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
                                <h2>{name}</h2>
                                <span>membro desde 2021</span>
                            </span>
                        </UserProfile>

                        <UserSeparator/>

                        <UserStatsContainer>
                            <UserStats>
                            <BookOpen/>
                                <span>
                                    <h3>853</h3>
                                    <span>Páginas lidas</span>
                                </span>
                            </UserStats>

                            <UserStats>
                                <Books />
                                <span>
                                    <h3>3</h3>
                                    <span>Livros avaliados</span>
                                </span>
                            </UserStats>

                            <UserStats>
                            <UserList/>
                                <span>
                                    <h3>3</h3>
                                    <span>Autores lidos</span>
                                </span>
                            </UserStats>

                            <UserStats>
                                <BookmarkSimple/>
                                <span>
                                    <h3>Horror</h3>
                                    <span>Categoria mais lida</span>
                                </span>
                            </UserStats>
                        </UserStatsContainer>
            </UserContainer>

        </ProfileContainer>
    </Container>
    )
}