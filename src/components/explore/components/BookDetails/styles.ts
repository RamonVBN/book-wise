import { styled } from "@/pages/globalStyles";
import { all } from "axios";


export const BookDetailsOverlay = styled('div', {

    position: 'absolute',
    top: 0,
    right: 0,
    
    width: '100vw',
    height: '100vh',

    backgroundColor: 'rgba(0, 0, 0, 0.6)',

})

export const BookDetailsContainer = styled('div', {

    height: '100%',
    width: '41.25rem',
    
    backgroundColor: '$gray800',
    boxShadow: '-4px 0px 30px 0 rgba(0, 0, 0, 0.5)',
    padding: '1.5rem 3rem',
    marginLeft: 'auto',

    display: 'flex',
    gap: '1rem',
    flexDirection: 'column',
 
})

export const CloseButton = styled('button', {

    all: 'unset',
    cursor: 'pointer',
    marginLeft: 'auto',

    svg: {
        minWidth: '1.5rem',
        minHeight: '1.5rem',
        color: '$gray400',  
    }
    
})

export const BookDetailsBody = styled('div', {

    display: 'flex',
    flexDirection: 'column',

    width: '100%',
    gap: '2rem',

    overflowY: 'scroll',
    scrollbarWidth: 'none'
})

export const BookInfo = styled('div', {

    width: '100%',
    backgroundColor: '$gray700',
    borderRadius: '10px',
    padding: '1.25rem 2rem 1rem 2rem',

    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',

})

export const BookInfoBody= styled('div', {

    width: '100%',
    display: 'flex',
    gap: '2rem',
    
    img: {
        height: '100%',
        width: '10.75rem',
        borderRadius: '10px'
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
                fontSize: '1rem',
                lineHeight: '$base',
                color: '$gray300'
            }
        },

        'span:last-child': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0.25rem',

            'span:first-child': {

                display: 'flex',
                flexDirection: 'row',
                gap: '0.25rem',

                svg: {
                    width: '1.25rem',
                    height: '1.25rem',

                    color: '$purple100'
                }
            },

            'span:last-child': {

                fontWeight: '$regular',
                fontSize: '0.875rem',
                lineHeight: '$base',
                color: '$gray400'
            }

            
        }
    }


})

export const BookInfoFooter = styled('div', {

    width: '100%',
    padding: '1.5rem 0',

    borderTop: '1px solid $gray600',

    display: 'flex',
    gap: '3rem',
    
    div: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',

        svg: {
            width: '1.5rem',
            height: '1.5rem',
            color: '$green100'
        },

        span: {
            display:'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            
            'span:first-child': {
                fontWeight: '$regular',
                fontSize: '0.875rem',
                lineHeight: '$base',
                color: '$gray300'

            },

            'span:last-child': {
                fontWeight: '$bold',
                fontSize: '1rem',
                lineHeight: '$short',
                color: '$gray200'
            }
        }
    }


})

export const BookDetailsRatingsContainer = styled('div', {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',

    gap: '1rem'

})

export const BookDetailsRatingsHeader = styled('span', {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',

    span: {
        fontWeight: '$regular',
        fontSize: '0.875rem',
        lineHeight: '$base',
        color: '$gray200',
    },

    button: {
        all: 'unset',
        cursor: 'pointer',

        fontWeight: '$bold',
        fontSize: '1rem',
        lineHeight: '$base',
        color: '$purple100',
        

        '&:hover': {
            textDecoration: 'underline'
        }
    }

})

export const BookDetailsRatingsBody = styled('div', {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',

    overflow: 'hidden'

})

export const BookDetailsRating = styled('div', {

    width: '100%',
    padding: '1.5rem',
    backgroundColor: '$gray700',
    borderRadius: '8px',

    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',

    div: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',

        div: {
            display: 'flex',
            justifyContent: 'flex-start',
            gap: '1rem',

            img: {
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '999px',

            },

            span: {
                display: 'flex',
                flexDirection: 'column',

                h3: {
                    fontWeight: '$bold',
                    fontSize: '1rem',
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

        },

        span: {
            display: 'flex',
            gap: '0.25rem',

            svg: {
                width: '1rem',
                height: '1rem',

                color: '$purple100'
            }
            
        },

    },
    
    p: {
        fontWeight: '$regular',
        fontSize: '0.875rem',
        lineHeight: '$base',
        color: '$gray300',
    }
})

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
            gap: '0.25rem',

            svg: {
                width: '1.75rem',
                height: '1.75rem',

                color: '$purple100',

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

export const ModalOverlay = styled('div', {

    position: 'absolute',
    zIndex: 10,
    top: 0,
    right: 0,

    width: '100vw',
    height: '100vh',

    backgroundColor: 'rgba(0, 0, 0, 0.6)',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',



})

export const ModalContainer = styled('div', {
    position: 'relative',

    padding: '3.5rem 4.5rem',
    borderRadius: '12px',
    backgroundColor: '$gray700',

    width: '32.25rem',

    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',

    h3: {
        fontWeight: '$bold',
        fontSize: '1rem',
        lineHeight: '$short',
        color: '$gray200',
        textAlign: 'center'
    },

    div: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },

    'button:has(svg)': {
       position: 'absolute',
       top: 16,
       right: 16
    }

})





