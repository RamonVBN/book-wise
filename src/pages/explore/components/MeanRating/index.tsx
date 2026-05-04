import { MeanRatingContainer, MeanRatingAmount } from "./styles"

type MeanRatingProps = {
  avgRating: number
}

export function MeanRating({ avgRating }: MeanRatingProps) {
  function formatAvgRating(rating: number): string {
    if (rating.toString().split(".")[1]?.length > 2) {
      return rating.toFixed(2).toString()
    }
    return rating.toString()
  }

  return (
    <MeanRatingContainer>
      <MeanRatingAmount>{formatAvgRating(avgRating)}</MeanRatingAmount>
    </MeanRatingContainer>
  )
}
