import { styled } from "@/pages/globalStyles";


export const FavoriteButtonContainer = styled('button', {
    all: 'unset',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: '$full',
    padding: '$2',
    backgroundColor: '$gray700',

    '&:hover': {
        backgroundColor: '$gray600',
    }
})