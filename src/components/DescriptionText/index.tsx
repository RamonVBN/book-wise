import { useState } from "react"
import { DescripitionTextContainer, ShowMoreButton } from "./styles"


type DescripitionTextProps = {
    description: string
}

export function DescripitionText({description}: DescripitionTextProps){
    
    const [showMore, setShowMore] = useState(false)

    return (
        <DescripitionTextContainer>
            {
                showMore && (
                    description
                )
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
        </DescripitionTextContainer>
    )
}