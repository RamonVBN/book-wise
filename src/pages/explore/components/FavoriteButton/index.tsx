import { Heart } from "phosphor-react";
import { FavoriteButtonComponent } from "./styles";

type FavoriteButtonProps = {
    isFavorite: boolean
    setIsFavorite: (isFavorite: boolean) => void
    disabled: boolean
}

export function FavoriteButton({ isFavorite, setIsFavorite, disabled }: FavoriteButtonProps) {

    return (
        <div>
            <FavoriteButtonComponent onClick={() => setIsFavorite(!isFavorite)} disabled={disabled}>
                <Heart weight={isFavorite ? 'fill' : 'regular'} />
            </FavoriteButtonComponent>
        </div>
    )
}