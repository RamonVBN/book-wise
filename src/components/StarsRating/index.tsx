import { Star, StarHalf } from "phosphor-react";
import { Container, StarRatingContainer } from "./style";

type StarRating = {
  param: number;
  showRate?: boolean;
};

export function StarRating({ param, showRate = false }: StarRating) {

  function formatRate(rate: number){

    if(rate.toString().includes('.')) {
      return rate
    } 

    return rate.toString().concat('.0')
  }

  return (
    <Container>
      <StarRatingContainer>
        {Array.from({ length: 5 }).map((_, i) => {
          if (param - (i + 1 - 1) >= 0.3 && param - (i + 1 - 1) <= 0.75) {
            return <StarHalf key={i} weight="fill" />;
          } else if (param - (i + 1 - 1) > 0.75) {
            return <Star key={i} weight="fill" />;
          }

          if (i + 1 > param) {
            return <Star key={i} />;
          }

          return <Star key={i} weight="fill" />;
        })}
      </StarRatingContainer>
      {showRate && <div>{formatRate(param)}</div>}
    </Container>
  );
}
