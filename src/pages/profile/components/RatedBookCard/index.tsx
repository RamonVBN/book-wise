import { ProfileResponse, RatingProps } from "@/@types/query-types"
import {   ModalBody, RatedBook, RatedBookInfo, RatedBooksContainer, RatedBookTime } from "./styles"
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

interface RatedBookProps {
    rating: RatingProps
}

export function RatedBookCard({rating}: RatedBookProps){

    const queryClient = useQueryClient()

    const [isUserRatingFormOpen, setisUserRatingFormOpen] = useState(false)

    const [isModalOpen, setIsModalOpen] = useState(false)

    const modalRef = useRef<HTMLDivElement | null>(null)

    const ratingId = rating.id
    const userId = rating.user.id

    function handleCloseUserRatingForm(){

        setisUserRatingFormOpen(false)
    }

    function handleRatingSubmit(data: UserRatingSubmitData){
        
        updateRatingMutation(data)
    }

    function handleDeleteRating(){

        deleteRatingMutation(ratingId)
        setIsModalOpen(false)
    }

    const {mutate: updateRatingMutation} = useMutation({
        mutationFn: async (data: UserRatingSubmitData) => {
            const newRate = data.rate
            const newReview = data.review
            return await api.put(`/app/ratings/users/${rating.id}`, {
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
                                <X />
                        </CloseButton>

                        <ModalBody>
                            <p>Tem certeza que deseja excluir sua avaliação?</p>

                            <div>
                                <button onClick={() => handleDeleteRating()}>Excluir</button>
                                <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
                            </div>
                        </ModalBody>
                    </Modal>
                )
            }
            
            <div>
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
                            {
                                !isUserRatingFormOpen && (
                                    <StarRating param={rating.rate}/>
                                )
                            }
                        </span>
                    </div>

                    <div>
                        <button onClick={() => setisUserRatingFormOpen(!isUserRatingFormOpen)}>
                            <Pencil size={24}/>
                        </button>
                        <button onClick={() => setIsModalOpen(true)}>
                            <Trash size={24}/>
                        </button>
                    </div>
                </RatedBookInfo>

                {
                    !isUserRatingFormOpen && (
                        <p>{rating.review}</p>
                    )
                }

                {
                    isUserRatingFormOpen && (
                        <UserRatingForm initialReview={rating.review} initialRate={rating.rate} profile={true} handleRatingSubmit={handleRatingSubmit}  handleCloseUserRatingForm={handleCloseUserRatingForm} />
                    )
                }
            </RatedBook>
            </div> 
    </>
    )
}