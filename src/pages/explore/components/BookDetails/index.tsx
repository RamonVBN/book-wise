import { BookmarkSimple, BookOpen, X } from "phosphor-react";

import { BookDetailsBody, BookDetailsContainer, BookDetailsOverlay, BookDetailsRatingsContainer, BookDetailsRatingsBody, BookDetailsRatingsHeader, BookInfo, BookInfoBody, BookInfoFooter, BookDetailsRating, CloseButton} from "./styles";

import { capitalize } from "@/utils/capitalize";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { formatCategories } from "@/utils/formatCategories";
import { useEffect, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { ProviderButton } from "@/pages/login/styles";

import Image from "next/image";

import googleLogo from '../../../../../assets/logos_google-icon.png'
import githubLogo from '../../../../../assets/akar-icons_github-fill.png'

import { api } from "@/lib/axios";
import { InfiniteData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookProps, BooksResponse, RatingProps } from "@/@types/query-types";
import { StarRating } from "@/components/StarsRating";
import { RatingDescription } from "@/components/RatingDescription";
import { UserRatingForm, UserRatingSubmitData } from "@/components/UserRatingForm";
import { Modal } from "@/components/Modal";
import { ReadingStatusSelect } from "../ReadingStatusSelect";

type BookDetailsProps = {
    closeBookDetails: () => void
    bookId: string
    debouncedQuery: string,
    categoriesFilters: string,
}

type BooksQueryData = {
  pages: {
    items: BookProps[]
  }[]
}

export function BookDetails({ closeBookDetails, bookId, debouncedQuery, categoriesFilters }: BookDetailsProps) {

    const queryClient = useQueryClient()

    const session = useSession()

    const [isUserRatingOpen, setIsUserRatingOpen] = useState(false)

    const [isModalOpen, setIsModalOpen] = useState(false)


    function handleUserRatingOpen() {

        if (session.status !== 'authenticated') {

            return setIsModalOpen(true)
        }

        return setIsUserRatingOpen(true)
    }

    function handleCloseUserRatingForm(){

        return setIsUserRatingOpen(false)
    }

    async function handleRatingSubmit(data: UserRatingSubmitData) {

        createRatingMutation(data)
    }

    function findBookById(bookId: string) {
    const queries = queryClient.getQueriesData<InfiniteData<BooksResponse>>({
    queryKey: ['books']
    })

    const book = queries
    .flatMap(([, data]) => data?.pages ?? [])
    .flatMap((page) => page.items)
    .find((book) => book.id === bookId)

    return book
    }

    const book = findBookById(bookId)
    
    const bookDetailsContainerRef = useRef<HTMLDivElement>(null)
    const modalRef = useRef<HTMLDivElement>(null)

    // useEffect(() => {
    //     function handleClickOutside(event: MouseEvent) {
            
    //         if (isModalOpen && modalRef.current &&
    //         !modalRef.current.contains(event.target as Node)) {
    //             return setIsModalOpen(false)
    //         }

    //         if (!isModalOpen && bookDetailsContainerRef.current && 
    //             !bookDetailsContainerRef.current.contains(event.target as Node)) {
                
    //             return closeBookDetails()
    //         }   
    //     }

    //     function handleEsc(event: KeyboardEvent) {
    //         if (event.key === "Escape") {


    //             if (isModalOpen){
    //                 return setIsModalOpen(false)
    //             }
    //             return closeBookDetails()   
    //         }
    //     }

    //     document.addEventListener("mousedown", handleClickOutside)
    //     document.addEventListener("keydown", handleEsc)

    //     return () => {
    //     document.removeEventListener("mousedown", handleClickOutside)
    //     document.removeEventListener("keydown", handleEsc)
    //     }
    // }, [closeBookDetails, isModalOpen, bookDetailsContainerRef, modalRef])

    const { data: bookRatings, refetch } = useQuery<RatingProps[]>({
    queryKey: ["ratings", bookId],
    queryFn: async () => {
    const response = await api.get(`/app/users/ratings?bookId=${bookId}`)
        return response.data
    },
    enabled: !!bookId
    })

    const {mutate: createRatingMutation} = useMutation({
        mutationFn: async (data: UserRatingSubmitData) => {
            return await api.post('/app/users/ratings', {
                rate: data.rate,
                review: data.review,
                bookId: book?.id,
                title: book?.title,
                author: book?.authors.join(','),
                coverUrl: book?.coverUrl,
                pageCount: book?.pageCount,
                categories: book?.categories.join(',')
            })
        },
        onMutate: async (data) => {

            await queryClient.cancelQueries({queryKey: ['books', debouncedQuery, categoriesFilters]})

            const previousBooks = queryClient.getQueryData(['books', debouncedQuery, categoriesFilters])

            queryClient.setQueryData<BooksQueryData>(['books', debouncedQuery, categoriesFilters], (oldData) => {

            if (!oldData) return oldData

            return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                ...page,
                items: page.items.map((book) => {

                    if (book.id !== bookId) return book

                    const newRatingsCount = book.ratingsCount + 1
                    const newRatingsSum = book.ratingsSum + data.rate!
                    const newAvg = newRatingsSum / newRatingsCount

                    return {
                    ...book,
                    avgRating: newAvg,
                    ratingsSum: newRatingsSum,
                    ratingsCount: newRatingsCount,
                    read: true
                    }
                })
                }))
            }
            })

            return { previousBooks } 
        },
        onError: (err, __, context) => {
            console.log(err)
            queryClient.setQueryData(['books', debouncedQuery, categoriesFilters], context?.previousBooks)
        },
        onSuccess(){
            setIsUserRatingOpen(false)
            refetch()
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ['books', debouncedQuery, categoriesFilters],
            })
        }
    })

    function onChange(status: string) {
        console.log(status)
    }

    if (!book){

        return
    }

    return (
        <>
            {
                isModalOpen && (
                    <Modal ref={modalRef}>
                        <CloseButton type="button" onClick={() => setIsModalOpen
                                (false)
                            }>
                                <X />
                        </CloseButton>
                            <h3>Faça login para deixar sua avaliação</h3>
                            <div>
                                <ProviderButton onClick={async () => signIn('google')}>
                                    <Image src={googleLogo} alt="" />
                                    Entrar com Google
                                </ProviderButton>

                                <ProviderButton onClick={async () => signIn('github')} >
                                    <Image src={githubLogo} alt="" />
                                    Entrar com Github
                                </ProviderButton>
                            </div>
                    </Modal>
                )
            }

            <BookDetailsOverlay>
                <BookDetailsContainer ref={bookDetailsContainerRef}>
                    <CloseButton onClick={closeBookDetails}>
                        <X />
                    </CloseButton>
                    <BookDetailsBody>
                        <BookInfo>
                            <BookInfoBody>
                                <Image loading="eager" quality={100} width={171.65} height={242} src={book.coverUrl} alt="" />
                                <div>
                                    <span>
                                        <h2>{book?.title}</h2>
                                        <span>{book?.authors}</span>
                                    </span>
                                    <span>
                                        <span>
                                            <StarRating param={book.avgRating} />
                                        </span>
                                        <span>
                                            {book.ratingsCount} {book.ratingsCount === 1 ? 'avaliação' : 'avaliações'}
                                        </span>
                                    </span>
                                </div>
                            </BookInfoBody>

                            <BookInfoFooter>
                                <div>
                                    <BookmarkSimple />
                                    <span>
                                        <span>Categoria(s)</span>
                                        <span>
                                            {book?.categories.map((c, i) => {
                                                return (
                                                    formatCategories(c, i)
                                                )
                                            })}
                                        </span>
                                    </span>
                                </div>
                                <div>
                                    <BookOpen />
                                    <span>
                                        <span>Páginas</span>
                                        <span>{book?.pageCount}</span>
                                    </span>
                                </div>

                                <div>
                                    <ReadingStatusSelect onChange={onChange}/>
                                </div>
                            </BookInfoFooter>
                        </BookInfo>

                        <BookDetailsRatingsContainer>
                            <BookDetailsRatingsHeader>
                                <span>Avaliações</span>

                                {
                                    !book.read && (
                                        <button  type="button" onClick={() => handleUserRatingOpen()}>Avaliar</button>
                                    )
                                }

                            </BookDetailsRatingsHeader>

                            <BookDetailsRatingsBody>

                                {
                                    isUserRatingOpen && (
                                        <UserRatingForm handleCloseUserRatingForm={handleCloseUserRatingForm} handleRatingSubmit={handleRatingSubmit} avatarUrl={session.data?.user.avatarUrl} userName={session.data?.user.name} />
                                    )
                                }

                                {
                                    bookRatings && bookRatings.map((rating) => {
                                        return (
                                            <BookDetailsRating isUserRating={rating.user.email === session.data?.user.email} key={rating.id}>
                                                <div>
                                                    <div>
                                                        <Image width={40} height={40} src={rating.user.avatarUrl} alt="" />
                                                        <span>
                                                            <h3>{rating.user.name}</h3>
                                                            <span>{capitalize(formatDistanceToNow(rating.createdAt, { addSuffix: true, locale: ptBR }))}</span>
                                                        </span>
                                                    </div>

                                                    <span>
                                                        <StarRating param={rating.rate} />
                                                    </span>
                                                </div>

                                                <RatingDescription description={rating.review}/>
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