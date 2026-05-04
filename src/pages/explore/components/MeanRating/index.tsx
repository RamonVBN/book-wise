import { MeanRatingContainer, MeanRatingAmount } from "./styles";

type MeanRatingProps = {
    avgRating: number
}

export function MeanRating({ avgRating }: MeanRatingProps) {

    return (
        <MeanRatingContainer>
            <MeanRatingAmount>
                {avgRating.toFixed(2).toString()}
            </MeanRatingAmount>
        </MeanRatingContainer>
    )
}