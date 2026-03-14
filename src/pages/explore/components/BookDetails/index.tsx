import { BookmarkSimple, BookOpen, Check, Star, StarHalf, X } from "phosphor-react";

import { BookDetailsBody, BookDetailsContainer, BookDetailsOverlay, BookDetailsRatingsContainer, BookDetailsRatingsBody, BookDetailsRatingsHeader, BookInfo, BookInfoBody, BookInfoFooter, BookDetailsRating, CloseButton, UserRatingContainer, CancelButton, ConfirmButton, ModalOverlay, ModalContainer, FormError } from "./styles";

import { capitalize } from "@/utils/capitalize";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { formatCategories } from "@/utils/formatCategories";
import { useEffect, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ProviderButton } from "@/pages/login/styles";

import Image from "next/image";

import googleLogo from '../../../../../assets/logos_google-icon.png'
import githubLogo from '../../../../../assets/akar-icons_github-fill.png'

import { api } from "@/lib/axios";
import { InfiniteData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookProps, BooksResponse, RatingProps } from "@/@types/query-types";
import { StarRating } from "@/components/StarsRating";
import { RatingDescription } from "@/components/RatingDescription";

type BookDetailsProps = {

    closeBookDetails: () => void
    bookId: string
    debouncedQuery: string,
    categoriesFilters: string
}

type BooksQueryData = {
  pages: {
    items: BookProps[]
  }[]
}

const userRatingForm = z.object({
    review: z.string()
})

type UserRatingFormData = z.infer<typeof userRatingForm>


export function BookDetails({ closeBookDetails, bookId, debouncedQuery, categoriesFilters }: BookDetailsProps) {

    const queryClient = useQueryClient()

    const { register, handleSubmit, reset } = useForm<UserRatingFormData>()

    const session = useSession()

    const [isUserRatingOpen, setIsUserRatingOpen] = useState(false)

    const [rateHover, setRateHover] = useState(0)

    const [definedRate, setDefinedRate] = useState<number | null>(null)

    const [isError, setIsError] = useState(false)

    const [isModalOpen, setIsModalOpen] = useState(false)


    function handleUserRatingOpen() {

        if (session.status !== 'authenticated') {

            return setIsModalOpen(true)
        }

        return setIsUserRatingOpen(true)
    }

    async function handleRatingSubmit(data: UserRatingFormData) {

        if (!definedRate) {
            return setIsError(true)
        }

        createRatingMutation(data)
    }

    function handleDefineRate(index: number) {

        if (definedRate === index) {
            return setDefinedRate(null)
        }

        if (index) {

            return setDefinedRate(index)
        }
    }

    function handleMouseOver(index: number, e: React.MouseEvent<HTMLDivElement>) {

        const { left, width } = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - left;
        const half = width / 2;
        const isHalf = x > half;
        const value = index + (isHalf ? 1 : 0.5);

        setRateHover(value)
    }

    function handleRate() {

        const value = definedRate ?? rateHover

        const starRate = Array.from({ length: 5 })

        return starRate.map((_, i) => {

            if (value >= i + 1) {

                return (
                    <div key={i} onClick={() => handleDefineRate(rateHover)} onMouseLeave={() => setRateHover(0)} onMouseOver={(e) => handleMouseOver(i, e)}>
                        <Star weight='fill' />
                    </div>
                )
            } else if (value >= i + 0.5) {
                return (
                    <div key={i} onClick={() => handleDefineRate(rateHover)} onMouseOut={() => setRateHover(0)} onMouseOver={(e) => handleMouseOver(i, e)}>
                        <StarHalf weight='fill' />
                    </div>
                )
            } else {
                return (
                    <div key={i} onClick={() => handleDefineRate(rateHover)} onMouseOut={() => setRateHover(0)} onMouseOver={(e) => handleMouseOver(i, e)}>
                        <Star weight='regular' />
                    </div>
                )
            }

        })

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
    
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
        if (
            modalRef.current &&
            !modalRef.current.contains(event.target as Node)
        ) {
            closeBookDetails()
        }
        }

        function handleEsc(event: KeyboardEvent) {
        if (event.key === "Escape") {
            closeBookDetails()
        }
        }

        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleEsc)

        return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        document.removeEventListener("keydown", handleEsc)
        }
    }, [closeBookDetails])

    const { data: bookRatings, refetch } = useQuery<RatingProps[]>({
    queryKey: ["ratings", bookId],
    queryFn: async () => {
    const response = await api.get(`/app/users/ratings?bookId=${bookId}`)
        return response.data
    },
    enabled: !!bookId
    })

    const {mutate: createRatingMutation} = useMutation({
        mutationFn: async (data: UserRatingFormData) => {
            return await api.post('/app/users/ratings', {
                rate: definedRate,
                review: data.review,
                bookId: book?.id,
                title: book?.title,
                author: book?.authors.join(','),
                coverUrl: book?.coverUrl,
                pageCount: book?.pageCount,
                categories: book?.categories.join(',')
            })
        },
        onMutate: async () => {

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
                    const newRatingsSum = book.ratingsSum + definedRate!
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
            reset()
            setIsUserRatingOpen(false)
            setDefinedRate(null)
            refetch()
        }
    })

    if (!book){

        return
    }

    return (
        <>
            {
                isModalOpen && (
                    <ModalOverlay >
                        <ModalContainer>
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
                        </ModalContainer>
                    </ModalOverlay>
                )
            }

            <BookDetailsOverlay>
                <BookDetailsContainer ref={modalRef}>
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
                                            {book?.categories.map((category, i) => {
                                                return (
                                                    formatCategories(category, i)
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
                                                <textarea {...register('review')} placeholder="Escreva sua avaliação" />
                                                <span>
                                                    <CancelButton type="button" onClick={() => setIsUserRatingOpen(false)}>
                                                        <X />
                                                    </CancelButton>

                                                    <ConfirmButton type="submit">
                                                        <Check />
                                                    </ConfirmButton>
                                                </span>
                                            </form>
                                        </UserRatingContainer>
                                    )
                                }
                                {
                                    bookRatings && bookRatings.toReversed().map((rating, i) => {
                                        return (
                                            <BookDetailsRating isUserRating={book.read} key={i}>
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