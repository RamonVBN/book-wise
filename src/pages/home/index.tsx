import Image from "next/image";
import { BookRating, BooksRatingsContainer, MainBody, HomeContainer, MainContainer, MainHeader, MenuContainer, MenuNavigation, NavButton, SignInButton, SignOutButton, MainAside, MainAsideBody, PopBook, BookRatingHeader, BookRatingUser, Rating, BookRatingBody, BookRatingDescription, PopBookDescription, ProfileForm, ProfileInput, ProfileButton, ProfileContainer, ProfileUser, ProfileSeparator, ProfileStatsContainer, ProfileStats, RatedBook, RatedBookInfo, RatedBookTime } from "./styles";
import logo from '../../../assets/Logo.png'
import { Binoculars, BookmarkSimple, BookOpen, Books, CaretRight, ChartLineUp, MagnifyingGlass, SignIn, SignOut, Star, User, UserList } from "phosphor-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { useState } from "react";
import { books } from "../../../prisma/seeds/constants/books";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {ptBR} from 'date-fns/locale/pt-BR'


type HomeProps = {
    name: string
    avatarUrl: string
}


type Navigation = {
    
    buttonName: string
    active: boolean
}

const profileFormSchema = z.object({
    RatedBook: z.string().min(1)
})

type ProfileFormData = z.infer<typeof profileFormSchema>

type BookProps = {
    author: string
    name: string
    coverUrl: string,
    summary: string
}

type UserProps = {
    name: string
    avatarUrl: string
}

type RatingProps = {
    id: string
    rate : number
    description: string
    createdAt: string
    book: BookProps
    user: UserProps

}[]


export default function Home({avatarUrl, name}: HomeProps){

    const [navigation, setNavigation] = useState<Navigation[]>([
        {
            buttonName: 'start',
            active: true
        },
        {
            buttonName: 'explore',
            active: false
        },
        {
            buttonName: 'profile',
            active: false
        }
    ])

    const {register, handleSubmit, setFocus, reset} = useForm<ProfileFormData>()

    const [profileInput, setProfileInput] = useState<string>('')

    const router = useRouter()

    const session = useSession()

    const isSigned = session.status === 'authenticated'

    async function handleSignOut(){

        await signOut()

    }

    function handleMenuNavigationButtons(buttonName: string){

        navigation.map((button) => {
            if (button.buttonName === buttonName) {

                button.active = true
            }else{

                button.active = false
            }
        })

        setNavigation((prevState) => [...prevState])

    }

    function onSubmit(data: ProfileFormData){
        
        setProfileInput(data.RatedBook)

        reset()
        setFocus('RatedBook')
    }


    const {data: ratingData} = useQuery<{ratings: RatingProps}>({
        queryKey: ['ratings'],
        queryFn: async () => {

           const response = await api.get('/app/books/ratings')

           return response.data
        }
    })

    const profileRatings = ratingData?.ratings.toReversed().filter((rating) => 
        rating.user.name === name && 
        rating.book.name.toLowerCase().trim().includes(profileInput ? profileInput.trim().toLowerCase(): '') )


    return (
        <HomeContainer>
            <MenuContainer>
                <Image priority  width={128} height={32} src={logo} alt=""/>
                <MenuNavigation>

                    <NavButton isActive={navigation[0].active} onClick={(e) => handleMenuNavigationButtons(e.currentTarget.name)} name="start">
                    <ChartLineUp size={24} />
                    Início
                    </NavButton>
                    <NavButton isActive={navigation[1].active} onClick={(e) => handleMenuNavigationButtons(e.currentTarget.name)}  name="explore">
                    <Binoculars size={24} />
                    Explorar
                    </NavButton>

                    {
                        isSigned && (
                    <NavButton isActive={navigation[2].active} onClick={(e) => handleMenuNavigationButtons(e.currentTarget.name)} name="profile">
                        <User size={24} />
                        Perfil
                    </NavButton>
                    )
                    }
                </MenuNavigation>
                
                {
                    isSigned ? (
                        
                        <SignOutButton onClick={handleSignOut}>
                            <img width={32} height={32} src={avatarUrl} alt=""/>
                            <span>{name}</span>
                            <SignOut size={20}/>
                        </SignOutButton>
                    ) :

                <SignInButton onClick={() => router.push('/')}>
                    Fazer login
                    <SignIn size={20} />
                </SignInButton>
                }

            </MenuContainer>
                
                
                    <div>
                        <MainHeader>
                           {
                            navigation[0].active && (
                                <>
                                <ChartLineUp/>
                                <h1>Início</h1>
                                </>
                            )
                           }

                           {
                            navigation[1].active && (
                                <>
                                <Binoculars/>
                                <h1>Explorar</h1>
                                </>
                            )
                           }

{
                            navigation[2].active && (
                                <>
                                <User/>
                                <h1>Perfil</h1>
                                </>
                            )
                           }
                        </MainHeader>

                        {
                            navigation[2].active && (
                                <ProfileForm onSubmit={handleSubmit(onSubmit)}>
                                    <label >
                                        <ProfileInput {...register('RatedBook')} placeholder="Buscar livro avaliado" />
                                    </label>
                                    <ProfileButton>
                                        <MagnifyingGlass/>
                                    </ProfileButton>
                                </ProfileForm>
                               
                            )
                        }
                                       
                        
                        <BooksRatingsContainer>

                            {
                              navigation[0].active && ratingData && ratingData.ratings.toReversed().map((rating, i) => {
                                return (
                                <BookRating key={i}>
                                    <BookRatingHeader>
                                        <BookRatingUser>
                                            <img src={rating.user.avatarUrl} alt="" />
                                            <span>
                                                <span>{rating.user.name}</span>
                                                <span>Hoje</span>
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

                                    </BookRatingHeader>

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

{
                              navigation[2].active && profileRatings && profileRatings.map((profileRating, i) => {
                                
                                return (
                                <div key={i}>
                                <RatedBookTime>{formatDistanceToNow(profileRating.createdAt, {addSuffix: true, locale: ptBR})}</RatedBookTime>
                                <RatedBook >
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

                            {/* <BookRating>
                                <BookRatingHeader>
                                    <BookRatingUser>
                                        <img src={users[0].avatar_url} alt="" />
                                        <span>
                                            <span>{users[0].name}</span>
                                            <span>Hoje</span>
                                        </span>
                                    </BookRatingUser>
                                    <Rating>
                                        <Star weight="fill"/>
                                        <Star weight="fill" />
                                        <Star weight="fill" />
                                        <Star weight="fill" />
                                        <Star  />
                                    </Rating>

                                </BookRatingHeader>

                                <BookRatingBody>
                                    <img src={books[1].cover_url} alt="" />
                                    <BookRatingDescription>
                                        <span>
                                            <h2>{books[1].name}</h2>
                                            <span>{books[1].author}</span>
                                        </span>

                                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis voluptatem repellendus blanditiis sint aspernatur. Velit nulla quia reprehenderit quae sed consequuntur! Unde earum quia vitae odio, at incidunt dolor iste.</p>
                                    </BookRatingDescription>
                                </BookRatingBody>
                            </BookRating>

                            <BookRating>
                                <BookRatingHeader>
                                    <BookRatingUser>
                                        <img src={users[1].avatar_url} alt="" />
                                        <span>
                                            <span>{users[1].name}</span>
                                            <span>Hoje</span>
                                        </span>
                                    </BookRatingUser>
                                    <Rating>
                                        <Star weight="fill"/>
                                        <Star weight="fill" />
                                        <Star weight="fill" />
                                        <Star weight="fill" />
                                        <Star  />
                                    </Rating>

                                </BookRatingHeader>

                                <BookRatingBody>
                                    <img src={books[0].cover_url} alt="" />
                                    <BookRatingDescription>
                                        <span>
                                            <h2>{books[0].name}</h2>
                                            <span>{books[0].author}</span>
                                        </span>

                                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis voluptatem repellendus blanditiis sint aspernatur. Velit nulla quia reprehenderit quae sed consequuntur! Unde earum quia vitae odio, at incidunt dolor iste.</p>
                                    </BookRatingDescription>
                                </BookRatingBody>
                            </BookRating>

                            <BookRating>
                                <BookRatingHeader>
                                    <BookRatingUser>
                                        <img src={users[3].avatar_url} alt="" />
                                        <span>
                                            <span>{users[3].name}</span>
                                            <span>Hoje</span>
                                        </span>
                                    </BookRatingUser>
                                    <Rating>
                                        <Star weight="fill"/>
                                        <Star weight="fill" />
                                        <Star weight="fill" />
                                        <Star weight="fill" />
                                        <Star  />
                                    </Rating>

                                </BookRatingHeader>

                                <BookRatingBody>
                                    <img src={books[2].cover_url} alt="" />
                                    <BookRatingDescription>
                                        <span>
                                            <h2>{books[2].name}</h2>
                                            <span>{books[2].author}</span>
                                        </span>

                                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis voluptatem repellendus blanditiis sint aspernatur. Velit nulla quia reprehenderit quae sed consequuntur! Unde earum quia vitae odio, at incidunt dolor iste.</p>
                                    </BookRatingDescription>
                                </BookRatingBody>
                            </BookRating> */}
                            
                        </BooksRatingsContainer>
                        
                    </div>

                    <MainAside>
                        {
                            navigation[0].active && (
                                <>
                                <span>
                            <span>Livros populares</span>
                            <button>
                                Ver todos
                                <CaretRight weight="bold"/>
                            </button>
                            
                        </span>
                        <MainAsideBody>
                            <PopBook>
                                <img src={books[1].cover_url} alt="" />
                                <PopBookDescription>
                                    <span>
                                        <h2>{books[1].name}</h2>
                                        <span>{books[1].author}</span>
                                    </span>

                                    <Rating>
                                    <Star weight="fill"/>
                                        <Star weight="fill" />
                                        <Star weight="fill" />
                                        <Star weight="fill" />
                                        <Star  />
                                    </Rating>
                                </PopBookDescription>
                            </PopBook>

                            <PopBook>
                                <img src={books[0].cover_url} alt="" />
                                <PopBookDescription>
                                    <span>
                                        <h2>{books[0].name}</h2>
                                        <span>{books[0].author}</span>
                                    </span>

                                    <Rating>
                                    <Star weight="fill"/>
                                        <Star weight="fill" />
                                        <Star weight="fill" />
                                        <Star weight="fill" />
                                        <Star  />
                                    </Rating>
                                </PopBookDescription>
                            </PopBook>

                            <PopBook>
                                <img src={books[2].cover_url} alt="" />
                                <PopBookDescription>
                                    <span>
                                        <h2>{books[2].name}</h2>
                                        <span>{books[2].author}</span>
                                    </span>

                                    <Rating>
                                    <Star weight="fill"/>
                                        <Star weight="fill" />
                                        <Star weight="fill" />
                                        <Star weight="fill" />
                                        <Star  />
                                    </Rating>
                                </PopBookDescription>
                            </PopBook>

                            <PopBook>
                                <img src={books[3].cover_url} alt="" />
                                <PopBookDescription>
                                    <span>
                                        <h2>{books[3].name}</h2>
                                        <span>{books[3].author}</span>
                                    </span>

                                    <Rating>
                                    <Star weight="fill"/>
                                        <Star weight="fill" />
                                        <Star weight="fill" />
                                        <Star weight="fill" />
                                        <Star  />
                                    </Rating>
                                </PopBookDescription>
                            </PopBook>
                        </MainAsideBody>
                                </>
                            )
                        }

                        {
                            navigation[2].active && (
                                <ProfileContainer>
                                    <ProfileUser>
                                        <img src={avatarUrl} alt="" />
                                        <span>
                                            <h2>{name}</h2>
                                            <span>membro desde 2021</span>
                                        </span>
                                    </ProfileUser>

                                    <ProfileSeparator/>

                                    <ProfileStatsContainer>
                                        <ProfileStats>
                                        <BookOpen/>
                                            <span>
                                                <h3>853</h3>
                                                <span>Páginas lidas</span>
                                            </span>
                                        </ProfileStats>

                                        <ProfileStats>
                                            <Books />
                                            <span>
                                                <h3>3</h3>
                                                <span>Livros avaliados</span>
                                            </span>
                                        </ProfileStats>

                                        <ProfileStats>
                                        <UserList/>
                                            <span>
                                                <h3>3</h3>
                                                <span>Autores lidos</span>
                                            </span>
                                        </ProfileStats>

                                        <ProfileStats>
                                            <BookmarkSimple/>
                                            <span>
                                                <h3>Horror</h3>
                                                <span>Categoria mais lida</span>
                                            </span>
                                        </ProfileStats>
                                    </ProfileStatsContainer>
                                </ProfileContainer>
                            )
                        }
                    </MainAside>
                

        </HomeContainer>
    )
}


export const getServerSideProps: GetServerSideProps = async ({req, res}) => {

    const session: any = await getServerSession(req, res, authOptions)

   

    if (!session?.user) {
        
        return {
          props: {}
        }
    }

    return {
        props: {
           name: session?.user?.name,
           avatarUrl: session?.user.avatarUrl,
        }
    }
}


