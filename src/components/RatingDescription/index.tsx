import { useState } from "react"
import { ShowMoreButton } from "./styles"


type RatingDescription = {

    description: string
}


export function RatingDescription({description}: RatingDescription){


    const [showMore, setShowMore] = useState(false)

    return (
        <p>
            {
                showMore && (
                    description
                )

                
                // showMore ? (
                //     description
                // ):

                // description.split(' ').slice(0, 40).join(' ').concat('...')
            }

            {
                !showMore && description.split(' ').length > 40 ? (

                    description.split(' ').slice(0, 40).join(' ').concat('...')
                )
                :
                description
            }
            
            {
                description.split(' ').length > 40 && (
                    <ShowMoreButton onClick={() => setShowMore((prevState) => !prevState)}>Ver {showMore? 'menos' : 'mais'}</ShowMoreButton>
                )
            }
        </p>
    )
}