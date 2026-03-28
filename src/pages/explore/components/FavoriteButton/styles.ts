import { styled } from "@/pages/globalStyles";


export const FavoriteButtonComponent = styled('button', {
    all: 'unset',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: '$full',
    padding: '$2',
    backgroundColor: '$gray700',

    '&:not(:disabled):hover': {
        backgroundColor: '$gray600',
    },

    '&:disabled': {
        cursor: 'progress',
        opacity: 0.5,
    }
    
})