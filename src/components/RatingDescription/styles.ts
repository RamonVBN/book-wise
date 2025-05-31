import { styled } from "@/pages/globalStyles";


export const ShowMoreButton = styled('button', {

  
    all: 'unset',
    cursor: 'pointer',

    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',

    padding: '0.25rem 0.5rem',
    borderRadius: '4px',

    color: '$purple100',
    fontSize: '0.875rem',
    lineHeigth: '$base',
    fontWeight: '$bold',
    

    '&:hover': {
        backgroundColor: 'rgba(130, 129, 217, 0.06)'
    }
})