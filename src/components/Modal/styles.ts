import { styled } from "@/pages/globalStyles"

export const ModalOverlay = styled('div', {

    position: 'absolute',
    zIndex: 11,
    top: 0,
    right: 0,

    width: '100vw',
    height: '100vh',

    backgroundColor: 'rgba(0, 0, 0, 0.3)',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

})

export const ModalContainer = styled('div', {
    position: 'relative',

    padding: '3.5rem 4.5rem',
    borderRadius: '12px',
    backgroundColor: '$gray600',

    maxWidth: '32.25rem',

    h3: {
        fontWeight: '$bold',
        fontSize: '1rem',
        lineHeight: '$short',
        color: '$gray200',
        textAlign: 'center'
    },

    '& > button:has(svg)': {
       position: 'absolute',
       top: 16,
       right: 16
    }

})