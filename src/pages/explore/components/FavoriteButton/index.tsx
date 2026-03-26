import { Heart } from "phosphor-react";
import { FavoriteButtonContainer } from "./styles";

type FavoriteButtonProps = {
    isFavorite: boolean
    setIsFavorite: (isFavorite: boolean) => void
    disabled: boolean
}

export function FavoriteButton({ isFavorite, setIsFavorite, disabled }: FavoriteButtonProps) {

    return (
        <FavoriteButtonContainer onClick={() => setIsFavorite(!isFavorite)} disabled={disabled}>
            <Heart weight={isFavorite ? 'fill' : 'regular'} />
        </FavoriteButtonContainer>
    )
}