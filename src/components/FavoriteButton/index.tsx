import { Heart } from "phosphor-react";
import { FavoriteButtonComponent } from "./styles";

import { forwardRef } from "react";
import { AppTooltip } from "@/components/Tooltip";

type FavoriteButtonProps = {
  isFavorite: boolean;
  setIsFavorite: (isFavorite: boolean) => void;
  disabled?: boolean;
} & React.ComponentPropsWithoutRef<"button">;

export const FavoriteButton = forwardRef<
  HTMLButtonElement,
  FavoriteButtonProps
>(function FavoriteButton(
  { isFavorite, setIsFavorite, disabled, ...props },
  ref,
) {
  return (
    <AppTooltip
      content={isFavorite ? "Remover favorito" : "Adicionar aos favoritos"}
    >
      <FavoriteButtonComponent
        {...props}
        ref={ref}
        onClick={() => setIsFavorite(!isFavorite)}
        disabled={disabled}
      >
        <Heart weight={isFavorite ? "fill" : "regular"} />
      </FavoriteButtonComponent>
    </AppTooltip>
  );
});
