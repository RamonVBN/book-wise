import { MeanRatingContainer, MeanRatingAmount } from "./styles";

type MeanRatingProps = {
    avgRating: number
}

export function MeanRating({ avgRating }: MeanRatingProps) {


    return (
        <MeanRatingContainer>
            <MeanRatingAmount>
                {avgRating.toString()}
            </MeanRatingAmount>
        </MeanRatingContainer>
    )
}