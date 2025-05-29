import { Star, StarHalf } from "phosphor-react"

type StarRating = {
    param: number
}

export function StarRating({param}: StarRating){


    return (
        
        Array.from({length: 5}).map((_, i) => {
                                                    
            if ((param - ((i + 1) - 1)) > 0 && (param - ((i + 1) - 1)) < 1 ) {
                return (
                    <StarHalf key={i} weight="fill"/>  
                )
            }
            
            if (i + 1 > param) {

                
                return (
                    <Star key={i}/>
                )
            }

            return (<Star key={i} weight="fill"/>)
        })
)
}