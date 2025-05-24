import { styled } from "../../pages/globalStyles";

export const Container = styled('div', {
    display: 'flex',
    flexDirection: 'column',

    

})

export const HomeContainer = styled('div', {
    display: 'flex',
    gap: '6rem',
    height: '100%',

})

export const ContentContainer = styled('div', {

    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',

    overflowY: 'scroll',
    scrollbarWidth: 'none',

    width: '38rem',
})

export const BooksRatingsContainer = styled('div', {

    display: 'flex',
    flexDirection: 'column',

    borderBottom: '1px solid $gray600',
    
    gap: '0.75rem'

})

export const BooksRatingsContainerHeader = styled('span', {

    color: '$gray100',
    fontSize: '0.875rem',
    fontWeight: '$regular',
    lineHeight: '$base',

    
})

export const BookRating = styled('div', {
    backgroundColor: '$gray700',
    padding: '1.5rem',
    width: '100%',
    borderRadius: '8px',

    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
})

export const BookRatingUserContainer = styled('div', {

    display: 'flex',
    width: '100%',
    justifyContent: 'space-between'
})

export const BookRatingUser = styled('div', {

    display: 'flex',
    gap: '1rem',

    img: {
        width: '2.5rem',
        height: '2.5rem',
        borderRadius: '999px',
 
    },

    span: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',

        'span:first-child': {
            fontWeight: '$regular',
            fontSize: '1rem',
            lineHeight: '$base',
            color: '$gray100'
        },

        'span:last-child': {
            fontWeight: '$regular',
            fontSize: '0.875rem',
            lineHeight: '$base',
            color: '$gray400'
        }
    }
})

export const Rating = styled('div', {
    display: 'flex',
    gap: '0.25rem',

    svg: {
        width: '1rem',
        height: '1rem',
        color: '$purple100',
    }
})

export const BookRatingBody = styled('div', {

    display: 'flex',
    width: '100%',
    gap: '1.25rem',

    img: {
        width: '6.75rem',
        height: '9.5rem'
    },

    span: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',

        span: {
            fontWeight: '$regular',
            fontSize: '0.875rem',
            lineHeight: '$base',
            color: '$gray400'
        }
    },

    h2: {
        color: '$gray100',
        fontWeight: '$bold',
        lineHeight: '$short',
        fontSize: '1rem',

    },

    p: {
        color: '$gray300',
        lineHeight: '$base',
        fontSize: '0.875rem',
        fontWeight: '$regular',
        textAlign: 'justify',
    }

})

export const BookRatingDescription = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
})

export const PopBookContainer = styled('aside', {
    width: '20.25rem',
    

    span: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',

        'span:first-child': {
            fontWeight: '$regular',
            fontSize: '0.875rem',
            lineHeigth: '$base',
            color: '$gray100'
        },

        button: {
            all: 'unset',
            cursor: 'pointer',

            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',

            color: '$purple100',
            fontSize: '0.875rem',
            lineHeigth: '$base',
            fontWeight: '$bold',
            

            '&:hover': {
               textDecoration: 'underline'
            }
        }
    }

})

export const PopBookBody = styled('div', {
    
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',

    marginTop: '2rem'

})

export const PopBook = styled('div', {
    backgroundColor: '$gray700',
    padding: '1rem 1.25rem',
    borderRadius: '8px',

    width: 324,
    height: 130,

    display: 'flex',
    gap: '1.25rem',

    img: {
        width: '4rem',
        height: '5.875rem'
    },


})

export const PopBookDescription = styled('div', {

    height: '100%',

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    

    span: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        alignItems: 'flex-start',

        span: {
            fontWeight: '$regular',
            fontSize: '0.875rem',
            lineHeight: '$base',
            color: '$gray400'
        }
    },

    h2: {
        color: '$gray100',
        fontWeight: '$bold',
        lineHeight: '$short',
        fontSize: '1rem',
        textAlign: 'start'

    },
    

})

export const LastReadContainer = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',

    width: '100%',
    

})

export const LastReadHeader = styled('div', {

    width: '100%',

    display:'flex',
    justifyContent: 'space-between',

    span: {
        color: '$gray100',
        fontSize: '0.875rem',
        fontWeight: '$regular',
        lineHeight: '$base',
    },

    button: {

        all: 'unset',
        cursor: 'pointer',
        
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',

        color: '$purple100',
        fontSize: '0.875rem',
        fontWeight: '$bold',
        lineHeight: '$base',

        '&:hover': {
            textDecoration: 'underline'
        }
    }
})

export const LastReadBody = styled('div', {

    width: '100%',
    borderRadius: '8px',
    backgroundColor: '$gray600',
    
    padding: '1.25rem 1.5rem',

    display: 'flex',
    gap: '1.5rem',

    img: {
        height: '100%',
        width: '6.75rem',
        borderRadius: '4px',
    },


})

export const LastReadContent = styled('div', {

    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    width: '100%',

    'div:first-child': {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        width: '100%',
    
        
        'div:first-child': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',

            'span:first-child': {
                color: '$gray300',
                fontSize: '0.875rem',
                fontWeight: '$regular',
                lineHeight: '$base',

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

            h2: {
                fontWeight:'$bold',
                fontSize: '1rem',
                lineHeight: '$short',
                color: '$gray100',
            },

            span: {
                color: '$gray400',
                fontSize: '0.875rem',
                fontWeight: '$regular',
                lineHeight: '$base',
                
            }
        }


    },

    p: {
        color: '$gray300',
        fontSize: '0.875rem',
        fontWeight: '$regular',
        lineHeight: '$base',
    }
})



