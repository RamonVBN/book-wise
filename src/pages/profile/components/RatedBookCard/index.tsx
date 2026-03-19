import { RatingProps } from "@/@types/query-types"
import {   RatedBook, RatedBookInfo, RatedBooksContainer, RatedBookTime } from "./styles"
import { formatDistanceToNow } from "date-fns"
import { capitalize } from "@/utils/capitalize"
import Image from "next/image"
import { StarRating } from "@/components/StarsRating"
import { UserRatingForm, UserRatingSubmitData } from "@/components/UserRatingForm"
import { useState } from "react"
import { ptBR } from "date-fns/locale/pt-BR"
import { Pencil, Trash } from "phosphor-react"

interface RatedBookProps {
    rating: RatingProps
}

export function RatedBookCard({rating}: RatedBookProps){

    const [isUserRatingFormOpen, setisUserRatingFormOpen] = useState(false)

    function handleCloseUserRatingForm(){

        setisUserRatingFormOpen(false)
    }

    function handleRatingSubmit(data: UserRatingSubmitData){
        
    }

    return (
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
                        <button>
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
                        <UserRatingForm initialReview={rating.review} initialRate={rating.rate} profile={true} handleRatingSubmit={handleRatingSubmit}   handleCloseUserRatingForm={handleCloseUserRatingForm} />
                    )
                }
                
            </RatedBook>
            </div> 
    )
}