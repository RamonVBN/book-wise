import { BookmarkSimple, BookOpen, Check, Star, X } from "phosphor-react";

import { BookDetailsBody, BookDetailsContainer, BookDetailsOverlay, BookDetailsRatingsContainer, BookDetailsRatingsBody, BookDetailsRatingsHeader, BookInfo, BookInfoBody, BookInfoFooter, BookDetailsRating, CloseButton, UserRatingContainer, CancelButton, ConfirmButton, ModalOverlay, ModalContainer, FormError } from "./styles";

import { BooksProps } from "@/pages/app";
import { capitalize } from "@/utils/capitalize";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { calcMediaRating } from "@/utils/calcMediaRating";
import { formatCategories } from "@/utils/formatCategories";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ProviderButton } from "@/pages/login/styles";
import Image from "next/image";

import googleLogo from '../../../../../assets/logos_google-icon.png'
import githubLogo from '../../../../../assets/akar-icons_github-fill.png'
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

type BookDetailsProps ={

    closeBookDetails: () => void
    bookName: string
}

const userRatingForm = z.object({
    description: z.string()
})

type UserRatingFormData = z.infer<typeof userRatingForm>


export function BookDetails({closeBookDetails, bookName}: BookDetailsProps){

    const {register, handleSubmit, reset} = useForm<UserRatingFormData>()

    const session = useSession()

    const [isUserRatingOpen, setIsUserRatingOpen] = useState(false)

    const [rateOver, setRateOver] = useState(0)

    const [definedRate, setDefinedRate] = useState<number | null>(null)

    const [isError, setIsError] = useState(false)

    const [isModalOpen, setIsModalOpen] = useState(false)


    function handleUserRatingOpen(){

        if (session.status !==  'authenticated') {
            
            return setIsModalOpen(true)
        }

        return setIsUserRatingOpen(true)
    }

    async function handleRatingSubmit(data: UserRatingFormData){

        if (!definedRate) {
           return setIsError(true)
        }

        setIsError(false)

        await api.post('/app/users/create-rating', {
            rate: definedRate,
            description: data.description,
            bookId: book?.id,
            userId: session.data?.user.id
        })

        refetch()
        reset()
        setIsUserRatingOpen(false)
        setDefinedRate(null)
    }
    
    function handleDefineRate(index: number){

        if (definedRate === index) {
            return setDefinedRate(null)
        }

        if (index) {
            
            return setDefinedRate(index)
        }
    }
    
    function handleRate(rateOver: number){
        
        const starRate = Array.from({length: 5})
        
        return starRate.map((_, i) => {

            return <Star key={i} onClick={() => handleDefineRate(i + 1)} onMouseOut={() => setRateOver(0)} onMouseOver={() => setRateOver(i + 1)} weight={i + 1 <= rateOver ? 'fill': 'regular'}/>
        })

    }
    
    const {data: booksData, refetch} = useQuery<{books: BooksProps[]}>({

        queryKey: ['books'],
        queryFn: async () => {

            const response = await api.get('/app/books')

            return response.data
        },
        
    })

    const book = booksData?.books?.find((book) => book.name === bookName)

    return (
        <>
        {
            isModalOpen && (
        <ModalOverlay>
            <ModalContainer>
                <CloseButton type="button" onClick={() => setIsModalOpen
                    (false)
                }>
                    <X/>
                </CloseButton>
                <h3>Faça login para deixar sua avaliação</h3>
                <div>
                    <ProviderButton onClick={async () => signIn('google')}>
                        <Image src={googleLogo} alt=""/>
                        Entrar com Google
                    </ProviderButton>

                    <ProviderButton onClick={async () => signIn('github')} >
                        <Image src={githubLogo} alt=""/>
                        Entrar com Github
                    </ProviderButton>
                </div>
            </ModalContainer>
        </ModalOverlay>
            )
        }

        <BookDetailsOverlay>
            <BookDetailsContainer>
                <CloseButton onClick={closeBookDetails}>
                    <X/>
                </CloseButton>
                <BookDetailsBody>
                    <BookInfo>
                        <BookInfoBody>
                            <img src={book?.coverUrl} alt="" />
                            <div>
                                <span>
                                    <h2>{book?.name}</h2>
                                    <span>{book?.author}</span>
                                </span>

                                <span>
                                    <span>
                                        
                                       {
                                            Array.from({length: 5}).map((_, i) => {

                                                const bookMediaRating = book? calcMediaRating(book?.ratings) : 6

                                                if (i + 1 > bookMediaRating) {
                                                    
                                                    return (
                                                        <Star key={i}/>
                                                    )
                                                }

                                                return (
                                                    <Star key={i} weight="fill"/>
                                                )
                                            })
                                       }
                                    </span>
                                    <span>
                                        {book?.ratings.length} avaliações
                                    </span>
                                </span>
                            </div>
                        </BookInfoBody>

                        <BookInfoFooter>
                            <div>
                                <BookmarkSimple/>
                                <span>
                                    <span>Categoria(s)</span>
                                    <span>
                                        {book?.categories.map((category, i) => {
                                            return (
                                                formatCategories(category.category.name, i)
                                            )
                                        })}
                                    </span>
                                </span>
                            </div>
                            <div>
                                <BookOpen/>
                                <span>
                                   <span>Páginas</span>
                                   <span>{book?.totalPages}</span>
                                </span>
                            </div>
                        </BookInfoFooter>
                    </BookInfo>

                    <BookDetailsRatingsContainer>
                        <BookDetailsRatingsHeader>
                            <span>Avaliações</span>
                            <button type="button" onClick={() => handleUserRatingOpen() }>Avaliar</button>
                        </BookDetailsRatingsHeader>

                        <BookDetailsRatingsBody>

                        {
                            isUserRatingOpen && (
                        <UserRatingContainer>
                                <div>  

                                    <span>
                                        <img src={session.data?.user?.avatarUrl} alt="" />
                                        <h2>{session.data?.user?.name}</h2>
                                    </span>

                                    <span>
    
                                        <span>
                                        {
                                            handleRate(definedRate ?? rateOver)
                                        }
    
                                        </span>

                                        <span>
                                           
                                            <FormError isError={isError}>Selecione uma nota.</FormError>
                                            
                                        </span>
    
                                    </span>

                                </div>

                              
                                <form onSubmit={handleSubmit(handleRatingSubmit)}>
                                    <textarea {...register('description')} placeholder="Escreva sua avaliação"/>
                                    <span>
                                        <CancelButton type="button" onClick={() => setIsUserRatingOpen(false)}>
                                            <X/>
                                        </CancelButton>

                                        <ConfirmButton type="submit">
                                            <Check/>
                                        </ConfirmButton>
                                    </span>
                                </form>
                        </UserRatingContainer>
                            )
                        }
                                    
                            {
                                book?.ratings.toReversed().map((rating, i) =>  {
                                    return (
                                <BookDetailsRating isUserRating={rating.user.email === session.data?.user.email} key={i}>
                                    <div>
                                        <div>
                                            <img src={rating.user.avatarUrl} alt="" />
                                            <span>
                                                <h3>{rating.user.name}</h3>
                                                <span>{capitalize(formatDistanceToNow(rating.createdAt, {addSuffix:true, locale: ptBR}))}</span>
                                            </span>
                                        </div>

                                        <span>
                                            
                                            {
                                                Array.from({length: 5}).map((_, i) => {

                                                    if (i + 1 > rating.rate) {
                                                        
                                                    return (
                                                    <Star key={i}/>
                                                    )
                                                    }

                                                    return (
                                                        <Star key={i} weight="fill"/>
                                                    )
                                                })
                                            }
                                    
                                        </span>
                                    </div>

                                <p>{rating.description}</p>
                            </BookDetailsRating>
                                    )
                                })
                            }
               
                        </BookDetailsRatingsBody>
                    </BookDetailsRatingsContainer>
                </BookDetailsBody>
            </BookDetailsContainer>
        </BookDetailsOverlay>
    </>
    )
}