import { BookmarkSimple, BookOpen, Check, Star, X } from "phosphor-react";

import { BookDetailsBody, BookDetailsContainer, BookDetailsOverlay, BookDetailsRatingsContainer, BookDetailsRatingsBody, BookDetailsRatingsHeader, BookInfo, BookInfoBody, BookInfoFooter, BookDetailsRating, CloseButton, UserRatingContainer, CancelButton, ConfirmButton, ModalOverlay, ModalContainer } from "./styles";

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

type BookDetailsProps ={

    closeBookDetails: () => void
    books: BooksProps[] | undefined
    bookName: string
}

const userRatingForm = z.object({
    description: z.string()
})

type UserRatingFormData = z.infer<typeof userRatingForm>


export function BookDetails({closeBookDetails, books, bookName}: BookDetailsProps){

    const {register, handleSubmit} = useForm<UserRatingFormData>()

    const session = useSession()

    const [isUserRatingOpen, setIsUserRatingOpen] = useState(false)

    const [isModalOpen, setIsModalOpen] = useState(false)

    const book = books?.find((book) => book.name === bookName)

    function handleUserRatingOpen(){

        if (session.status !==  'authenticated') {
            
            return setIsModalOpen(true)
        }

        return setIsUserRatingOpen(true)
    }

    function handleRatingSubmit(data: UserRatingFormData){

        console.log(data)
    }
    

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
                                        <Star />
                                        <Star/>
                                        <Star/>
                                        <Star/>
                                        <Star/>
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
                                book?.ratings.map((rating, i) =>  {

                                    return (
                                        <BookDetailsRating key={i}>
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