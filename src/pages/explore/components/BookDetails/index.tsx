import { BookmarkSimple, BookOpen, Check, Star, StarHalf, X } from "phosphor-react";

import { BookDetailsBody, BookDetailsContainer, BookDetailsOverlay, BookDetailsRatingsContainer, BookDetailsRatingsBody, BookDetailsRatingsHeader, BookInfo, BookInfoBody, BookInfoFooter, BookDetailsRating, CloseButton, UserRatingContainer, CancelButton, ConfirmButton, ModalOverlay, ModalContainer, FormError } from "./styles";

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
import { BooksProps } from "@/@types/query-types";
import { StarRating } from "@/components/StarsRating";

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

    const [rateHover, setRateHover] = useState(0)

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

    function handleMouseOver(index: number, e: React.MouseEvent<HTMLDivElement>){

        const { left, width } = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - left;
        const half = width / 2;
        const isHalf = x > half;
        const value = index + (isHalf ? 1 : 0.5);

        setRateHover(value)
    }
    
    function handleRate(){

        const value = definedRate ?? rateHover
        
        const starRate = Array.from({length: 5})
        
        return starRate.map((_, i) => {

            if (value >= i + 1) {
                
            return (
                <div key={i} onClick={() => handleDefineRate(rateHover)} onMouseLeave={() => setRateHover(0)} onMouseOver={(e) => handleMouseOver(i , e)}>
                <Star  weight='fill' />
            </div>
            )
            }else if (value >= i + 0.5) {
                return (
                    <div key={i} onClick={() => handleDefineRate(rateHover)} onMouseOut={() => setRateHover(0)} onMouseOver={(e) => handleMouseOver(i , e)}>
                <StarHalf  weight='fill' />
            </div>
                )
            }else {
                return (
                    <div key={i} onClick={() => handleDefineRate(rateHover)} onMouseOut={() => setRateHover(0)} onMouseOver={(e) => handleMouseOver(i , e)}>
                    <Star  weight='regular' />
            </div>
                )
            }

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

    const bookMediaRating = book? calcMediaRating(book?.ratings) : 6

    const userEmail = session.data?.user.email

    const isUserRead = book?.ratings.some((rating) => rating.user.email === userEmail)

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

                                        <StarRating param={bookMediaRating} />

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
                                    </span>
                                    <span>
                                        {book?.ratings.length} {book && book?.ratings.length === 1? 'avaliação' : 'avaliações' }
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
                            
                            {
                                !isUserRead && (
                                    <button type="button" onClick={() => handleUserRatingOpen() }>Avaliar</button>
                                )
                            }
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
                                            handleRate()
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
                                <BookDetailsRating isUserRating={rating.user.email === userEmail} key={i}>
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
                                                <StarRating param={rating.rate}/>
                                                // Array.from({length: 5}).map((_, i) => {

                                                //     if (i + 1 > rating.rate) {
                                                        
                                                //     return (
                                                //     <Star key={i}/>
                                                //     )
                                                //     }

                                                //     return (
                                                //         <Star key={i} weight="fill"/>
                                                //     )
                                                // })
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