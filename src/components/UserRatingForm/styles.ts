import { styled } from "@/pages/globalStyles"

export const UserRatingContainer = styled('div', {

    backgroundColor: '$gray700',
    borderRadius: '8px',
    padding: '1.5rem',

    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    
    'div:first-child': {

        display: 'flex',
        justifyContent: 'space-between',

        'span:first-child': {

            display: 'flex',
            gap: '1rem',
            alignItems: 'center',

            img: {
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '999px'
            },

            h2: {
                fontWeight: '$bold',
                fontSize: '1rem',
                lineHeight: '$short',
                color: '$gray100'
            }

        },

        'span:last-child': {
            display: 'flex',
            flexDirection: 'column',
            
            gap: '0.25rem',

            span: {
                display: 'flex',
                gap: '0.25rem',
            },

            svg: {
                width: '1.75rem',
                height: '1.75rem',

                color: '$purple100',
                cursor: 'pointer',

            }
        }
    },

    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem', 
        

        textarea: {
            all: 'unset',
            width: '100%',
            height: '10.25rem',
            border: '1px solid transparent',

            backgroundColor: '$gray800',

            padding: '0.875rem 1.25rem',
            boxSizing: 'border-box',
            borderRadius: '4px',

            color: '$gray200',
            fontSize: '0.875rem',
            fontWeight: '$regular',
            lineHeight: '$base',

            '&:focus': {
                border: '1px solid $green200'
            }
        },

        span: {
            marginLeft: 'auto',
            display: 'flex',
            gap: '8px'
        }

    }

})

export const ConfirmButton = styled('button', {
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
})

export const CancelButton = styled('button', {
    all: 'unset',
    cursor: 'pointer',

    width: '2.5rem',
    height: '2.5rem',
    boxSizing: 'border-box',

    padding: '0.5rem',

    backgroundColor: '$gray600',
    borderRadius: '4px',

    svg: {
        color: '$purple100',
        width: '1.5rem',
        height: '1.5rem'
    },

    '&:hover': {
        backgroundColor: '$gray500'
    }

})

export const FormError = styled('pre', {
    
    fontSize: '0.75rem',
    fontWeight: '$medium',
    lineHeight: '$base',

    variants: {

        isError: {
            true: {
                color: 'IndianRed',
            },
    
            false: {
                color: '$gray700',
            }
        }
    },

    defaultVariants: {
        isError: false
    }
    
})