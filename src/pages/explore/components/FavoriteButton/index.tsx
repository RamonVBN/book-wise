import { Heart } from "phosphor-react";
import { FavoriteButtonContainer } from "./styles";

type FavoriteButtonProps = {
    isFavorite: boolean
    setIsFavorite: (isFavorite: boolean) => void
}

export function FavoriteButton({ isFavorite, setIsFavorite }: FavoriteButtonProps) {

    return (
        <FavoriteButtonContainer onClick={() => setIsFavorite(!isFavorite)}>
            <Heart weight={isFavorite ? 'fill' : 'regular'} />
        </FavoriteButtonContainer>
    )
}