import { ProfileResponse, RatingProps, RatingQueryData, UserBookProps, } from "@/@types/query-types"
import {   ModalBody, ProfileBook, ProfileBookInfo, ProfileBookTime} from "./styles"
import { formatDistanceToNow } from "date-fns"
import { capitalize } from "@/utils/capitalize"
import Image from "next/image"
import { StarRating } from "@/components/StarsRating"
import { UserRatingForm, UserRatingSubmitData } from "@/components/UserRatingForm"
import { useEffect, useRef, useState } from "react"
import { ptBR } from "date-fns/locale/pt-BR"
import { Pencil, Trash, X } from "phosphor-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { Modal } from "@/components/Modal"
import { CloseButton } from "@/pages/explore/components/BookDetails/styles"
import { ReadingStatus } from "@/generated/prisma"
import { ReadingStatusSelect } from "@/pages/explore/components/ReadingStatusSelect"
import { FavoriteButton } from "@/pages/explore/components/FavoriteButton"
import { ReadingProgressInput } from "../ReadingProgress"

interface RatedBookProps {
    userBook?: UserBookProps
    rating?: RatingProps
    isFavoriteList?: boolean
}

export function ProfileBookCard({userBook, isFavoriteList, rating}: RatedBookProps){

    const queryClient = useQueryClient()

    const [isUserRatingFormOpen, setisUserRatingFormOpen] = useState(false)

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [isSelectOpen, setIsSelectOpen] = useState(false)

    const modalRef = useRef<HTMLDivElement | null>(null)

    const ratingId = rating?.id
    const userId = rating?.user.id ?? userBook?.userId
    const book = rating?.book ?? userBook?.book

    function handleCloseUserRatingForm(){

        setisUserRatingFormOpen(false)
    }

    function handleRatingSubmit(data: UserRatingSubmitData){
        
        updateRatingMutation(data)
    }

    function handleDeleteRating(){

        if (ratingId) {

            deleteRatingMutation(ratingId)
            setIsModalOpen(false)
        } else {

            return console.log("Rating ID is undefined. Cannot delete rating.")
        }
    }

    function handleSelectOpenChange(isOpen: boolean) {
        setIsSelectOpen(!isOpen)
    }

    const {mutate: updateRatingMutation} = useMutation({
        mutationFn: async (data: UserRatingSubmitData) => {
            const newRate = data.rate
            const newReview = data.review
            return await api.put(`/app/ratings/users/${rating?.id}`, {
                newReview,
                newRate   
            })
        },
        onMutate: async (data) => {

            await queryClient.cancelQueries({queryKey: ["profile", userId]})

            const previousProfileData = queryClient.getQueryData(["profile", userId])

            queryClient.setQueryData<ProfileResponse>(["profile", userId], (oldData) => {

                if (!oldData) return oldData

                return {
                    ...oldData,
                    userRatings: oldData.userRatings.map((r) => {

                        if(r.id === ratingId){

                            return {
                                ...r,
                                review: data.review,
                                rate: data.rate
                            }
                        }

                        return r
                    })
                }
                })

                return { previousProfileData } 
        },
        onSuccess: () => {
            setisUserRatingFormOpen(false)
        },
        onError: (err, __, context) => {
            console.log(err)
            queryClient.setQueryData(["profile", userId], context?.previousProfileData)
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ['profile', userId],
            })

            queryClient.invalidateQueries({
                queryKey: ['books'],
            })
        }
    })

    const {mutate: deleteRatingMutation} = useMutation({
            mutationFn: async (ratingId: string) => {
                return await api.delete(`/app/ratings/users/${ratingId}`)
            },
            onMutate: async (ratingId) => {
    
                await queryClient.cancelQueries({queryKey: ["profile", userId]})
    
                const previousProfileData = queryClient.getQueryData(["profile", userId])
    
                queryClient.setQueryData<ProfileResponse>(["profile", userId], (oldData) => {
    
                    if (!oldData) return oldData
    
                    return {
                        ...oldData,
                        userRatings: oldData.userRatings.filter((r) => r.id !== ratingId)
                    }
    
                    })
    
                    return { previousProfileData } 
            },
            onError: (err, __, context) => {
                console.log(err)
                queryClient.setQueryData(["profile", userId], context?.previousProfileData)
            },
            onSettled: () => {
                queryClient.invalidateQueries({
                    queryKey: ['profile', userId],
                })
    
                queryClient.invalidateQueries({
                    queryKey: ['books'],
                })
            }
    })
    
    const {mutate: updateReadingStatusMutation, isPending: isUpdatingReadingStatus} = useMutation({
        mutationFn: async ({status, isFavorite = false}:{status?: ReadingStatus, isFavorite: boolean}) => {
            
            return await api.patch('/app/userBook', {
                readStatus: status,
                isFavorite: isFavorite,
                bookId: book?.id,
                title: book?.title,
                author: book?.author,
                coverUrl: book?.coverUrl,
                pageCount: book?.pageCount,
                categories: book?.categories
            })
        },
        onMutate: async ({status, isFavorite}) => {

            await queryClient.cancelQueries({queryKey: ['profile', userId]})

            const previousProfileData = queryClient.getQueryData(['profile', userId])

            queryClient.setQueryData<ProfileResponse>(['profile', userId], (oldData) => {

            if (!oldData) return oldData

            const updatedProfileData = oldData.abandonedBooks.concat(oldData.currentlyReadingBooks, oldData.finishedBooks, oldData.wantToReadBooks).map((ub) => {
                if (ub.id === userBook?.id) {
                    return {
                        ...ub,
                        status: status ?? ub.status,
                        isFavorite: isFavorite ?? ub.isFavorite
                    }
                }
                return ub
            })

            const currentlyReadingBooks = updatedProfileData.filter((ub) => ub.status === 'READING')
            const wantToReadBooks = updatedProfileData.filter((ub) => ub.status === 'WANT_TO_READ')
            const finishedBooks = updatedProfileData.filter((ub) => ub.status === 'FINISHED')
            const abandonedBooks = updatedProfileData.filter((ub) => ub.status === 'ABANDONED')
            const favoriteBooks = updatedProfileData.filter((ub) => ub.isFavorite)

            return {
                ...oldData,
                currentlyReadingBooks,
                wantToReadBooks,
                finishedBooks,
                abandonedBooks,
                favoriteBooks
            }})

            return { previousProfileData } 
        },
        onError: (err, __, context) => {
            console.log(err)
            queryClient.setQueryData(['profile', userId], context?.previousProfileData)
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ['profile', userId],
            })

            queryClient.invalidateQueries({
                queryKey: ['books'],
            })
        }
    })
    
    function handleClickOutside(event: React.PointerEvent<HTMLDivElement>) {
        
        if (isModalOpen && modalRef.current &&
        !modalRef.current.contains(event.target as Node)) {
            return setIsModalOpen(false)
        }
    }

    function handleEsc(event: React.KeyboardEvent<HTMLDivElement>) {
        if (event.key === "Escape" && isModalOpen) {
            return setIsModalOpen(false)   
        }
    }

    function onSelectChange(status: ReadingStatus) {
        updateReadingStatusMutation({status, isFavorite: userBook!.isFavorite})
    }

    useEffect(() => {
        modalRef.current?.focus()
    }, [isModalOpen])

    return (
    <>
            {
                isModalOpen && (
                    <Modal onKeyDown={handleEsc} onPointerDown={handleClickOutside} ref={modalRef}>
                        <CloseButton type="button" onClick={() => setIsModalOpen
                                (false)
                            }>
                                <X/>
                        </CloseButton>

                        <ModalBody>
                            <p>{
                                rating ? "Tem certeza que deseja excluir sua avaliação?" : "Tem certeza que deseja excluir este livro da sua estante?"}
                            </p>

                            <div>
                                <button onClick={() => handleDeleteRating()}>Excluir</button>
                                <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
                            </div>
                        </ModalBody>
                    </Modal>
                )
            }
            
            <div>
            {
                rating && (
                    <ProfileBookTime>{capitalize(formatDistanceToNow(rating.createdAt, {addSuffix: true, locale: ptBR}))}</ProfileBookTime>
                )
            }
            <ProfileBook>
                <ProfileBookInfo>
                    {
                        book && (
                            <Image width={98} height={134} src={book?.coverUrl} alt="" />
                        )
                    }
                    <div>
                        <span>
                        <h2>{book?.title}</h2>
                        <span>{book?.author}</span>
                        </span>
                        
                        <span>
                            {
                                rating && !isUserRatingFormOpen && (
                                    <StarRating param={rating.rate}/>
                                )
                            }
                        </span>
                    </div>

                    <div>
                        {
                            userBook && !isFavoriteList && (
                                <ReadingStatusSelect disabled={isUpdatingReadingStatus} onChange={onSelectChange} handleSelectOpenChange={handleSelectOpenChange} isSelectOpen={isSelectOpen} value={userBook.status} />
                            )
                        }

                        {
                            userBook && isFavoriteList && (
                                <FavoriteButton disabled={isUpdatingReadingStatus} isFavorite={userBook.isFavorite} setIsFavorite={(isFavorite) => updateReadingStatusMutation({isFavorite, status: userBook.status})} />
                            )
                        }
                    </div>

                    <div>
                        {
                            rating && (
                                <button onClick={() => setisUserRatingFormOpen(!isUserRatingFormOpen)}>
                                    <Pencil size={24}/>
                                </button>
                            )
                        }

                        <button onClick={() => setIsModalOpen(true)}>
                            <Trash size={24}/>
                        </button>
                    </div>
                </ProfileBookInfo>

                {
                    rating && !isUserRatingFormOpen && (
                        <p>{rating.review}</p>
                    )
                }

                {
                    rating && isUserRatingFormOpen && (
                        <UserRatingForm initialReview={rating.review} initialRate={rating.rate} profile={true} handleRatingSubmit={handleRatingSubmit}  handleCloseUserRatingForm={handleCloseUserRatingForm} />
                    )
                }
            </ProfileBook>
            </div> 
    </>
    )
}