import { useState } from "react"
import { DescripitionTextContainer, ShowMoreButton } from "./styles"


type DescripitionTextProps = {
    description: string
    showMoreButton?: boolean
}

export function DescripitionText({description, showMoreButton=false}: DescripitionTextProps){
    
    const [showMore, setShowMore] = useState(false)

    const maxLenght = 150

    return (
        <DescripitionTextContainer>

            {
                
                (!showMore && description.split('').length > maxLenght) ? (

                    description.split('').slice(0, maxLenght).join('').concat('...')
                )
                :
                description
            }
            
            {
                showMoreButton && description.split('').length > maxLenght && (
                    <ShowMoreButton onClick={() => setShowMore((prevState) => !prevState)}>Ver {showMore? 'menos' : 'mais'}</ShowMoreButton>
                )
            }
        </DescripitionTextContainer>
    )
}