import { styled } from "@/pages/globalStyles"
import { FileX } from "phosphor-react"

export const RatedBooksContainer = styled('div', {
    
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '38rem',

    maxHeight: '42rem',
    overflowY: 'scroll',
    scrollbarWidth: 'none',
    
    gap: '0.75rem',

})

export const RatedBook = styled('div', {

    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    padding: '1.5rem',

    marginBottom: '1rem',
    marginTop: '0.5rem',

    width: '100%',
    backgroundColor: '$gray700',
    borderRadius: '8px',

    p: {
        fontWeight: '$regular',
        fontSize: '0.875rem',
        lineHeight: '$base',
        color: '$gray100',
        textAlign: 'justify'
    }

})

export const RatedBookInfo = styled('div', {

    display: 'flex',
    gap: '1.5rem',
    
    img: {
        width: '6.125rem',
        height: '8.375rem'
    },

    div: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',

        'span:first-child': {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',

            h2: {
                fontWeight: '$bold',
                fontSize: '1.125rem',
                lineHeight: '$short',
                color: '$gray100'
            },

            span: {
                fontWeight: '$regular',
                fontSize: '0.875rem',
                lineHeight: '$base',
                color: '$gray400'
            }
        },

        'span:last-child': {
            display: 'flex',
            gap: '0.25rem',

            svg: {
                color: '$purple100'
            }
        }
    },

    'div:last-child': {
        display: 'flex',
        flexDirection: "row",
        marginLeft: 'auto',
        gap: '$3',
        paddingRight: '24px',

        button: {
            all: 'unset',
            cursor: 'pointer',

            width: '2.5rem',
            height: '2.5rem',
            boxSizing: 'border-box',

            padding: '0.5rem',

            backgroundColor: '$gray600',
            borderRadius: '4px',

            svg: {
                color: '$green100',
                width: '1.5rem',
                height: '1.5rem'
            },

            '&:hover': {
                backgroundColor: '$gray500'
            }
        }
    }

   
})

export const RatedBookTime = styled('span', {

    fontSize: '0.875rem',
    fontWeight: '$regular',
    lineHeight: '$base',
    color: '$gray300',
})

export const ModalBody = styled('div', {

    height: '120px',

    color: '$gray100',
    display: 'flex',
    flexDirection: 'column',
    justifyContent:'space-between',
    alignItems: 'center',
    gap: '24px',

    p: {
        fontWeight: '$bold'
    },
    

    div: {
        display: 'flex',
        flexDirection: 'row',

        button: {
            display: 'flex',
            justifyItems: 'center',
            alignItems: 'center',

            all: 'unset',
            cursor: 'pointer',
            height: '3rem',
            boxSizing: 'border-box',

            padding: '0.5rem',

            backgroundColor: '$gray600',
            borderRadius: '4px',


            '&:hover': {
                backgroundColor: '$gray500'
            }
        },

        'button:first-child': {
            backgroundColor: '#B91C1C',
            '&:hover': {
                backgroundColor: '#EF4444'
            }
        }
    }
})