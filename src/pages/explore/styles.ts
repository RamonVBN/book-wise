import { styled } from "@/pages/globalStyles";


export const ExploreContainer = styled('div', {
    
    display: 'flex',
    flexDirection: 'column',
    flex: '0 1 83.5rem',

    overflowY: 'scroll',
    scrollbarWidth: 'none',

    

    borderBottom: '1px solid $gray600',

    '@media(max-width: 900px)': {
        paddingInline: '2rem'

    }
    
})

export const ExploreHeader = styled('div', {

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    form: {
        display: 'flex',
        flexBasis: '27.0625rem',
        marginLeft: '3rem',
    },

    label: {
        width: '100%',
        backgroundColor: '$gray800',
        borderTop: '1px solid $gray500',
        borderLeft: '1px solid $gray500',
        borderBottom: '1px solid $gray500',
        borderRadius: '4px 0px 0px 4px',
    
        padding: '0.875rem 1.25rem',

        display: 'flex',
        alignItems: 'center',
        
    },
    
    '&:has(input:focus)': {
        
        label: {
            borderColor: '$green200',
        },

        button: {
            borderColor: '$green200',
            svg: {
                color: '$green200'
            }
        }
    },

    '@media(max-width: 900px)': {
       marginTop: '18rem'
    }
})

export const ExploreInput = styled('input', {
    all: 'unset',
    backgroundColor: 'transparent',
    color: '$gray100',


    '&::placeholder': {
        color: '$gray400'
    },
})

export const ExploreFormButton = styled('button', {
    all: 'unset',
    cursor: 'pointer',
    boxSizing: 'border-box',

    borderTop: '1px solid $gray500',
    borderRight: '1px solid $gray500',
    borderBottom: '1px solid $gray500',
    padding: '0.875rem 1.25rem',
    borderRadius: '0px 4px 4px 0px',

    svg: {
        color: '$gray500',
        width: '1.25rem',
        height: '1.25rem'
    }
})

export const ExploreCategoriesContainer = styled('div', {

    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',


})

export const ExploreCategory = styled('button', {
    all: 'unset',
    cursor: 'pointer',
    padding: '0.25rem 1rem',
    
    borderRadius: '999px',

    fontSize: '1rem',
    fontWeight: '$regular',
    lineHeight: '$base',


    variants: {

        isActive: {
            true: {
                color: '$gray100',
                backgroundColor: '$purple200',
                border: '1px solid $purple200',

                '&:hover': {
                    border: '1px solid $purple100',

                },
            },

            false: {
                color: '$purple100',
                border: '1px solid $purple100',

                '&:hover': {
                    color: '$gray100',
                    backgroundColor: '$purple200',
                },
                
            }
        }
    },


    defaultVariants: {
        isActive: 'false'
    }
    
})

export const ExploreBooksContainer = styled('div', {

    marginTop: '3rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.25rem',

    '@media(max-width: 1500px)': {
        gridTemplateColumns: 'repeat(3, 1fr)',

    },

    '@media(max-width: 1200px)': {
        gridTemplateColumns: 'repeat(2, 1fr)',

    },

    
    // '@media(max-width: 900px)': {
    //     gridTemplateColumns: 'repeat(1, 1fr)',

    // }

})

export const ExploreBook = styled('button', {
    all: 'unset',
    cursor: 'pointer',
    boxSizing: 'border-box',

    position: 'relative',

    border: '2px solid transparent',

    display: 'flex',
    gap: '1.25rem',
    padding: '1rem 1.25rem',

    borderRadius: '8px',
    backgroundColor: '$gray700',

    // maxWidth: '19.9375rem',
    height: '11.5rem',

    '&:hover': {
        border: '2px solid $gray600',
    },

    img: {
        borderRadius: '0.25rem',
        height: '100%',
        width: '6.75rem',
    },

    div: {

        display:'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',

        height: '100%',

        'span:first-child': {

            h2: {
                fontSize: '1rem',
                fontWeight: '$bold',
                lineHeight: '$short',
                color: '$gray100'
            },

            span: {
                fontSize: '0.875rem',
                fontWeight: '$regular',
                lineHeight: '$base',
                color: '$gray400'
            }
        },

        'span:last-child': {
            display: 'flex',
            gap: '0.25rem',

            svg: {
                width: '1rem',
                height: '1rem',

                color: '$purple100'
            }
        }

    },

    '@media(max-width: 900px)': {
        justifySelf: 'center',
        width: '100%'
    }

})

export const ReadMark = styled('span', {

    position: 'absolute',
    top: -2,
    right: -2,

    padding: '0.25rem 0.75rem',
    backgroundColor: '$green300',
    color: '$green100',
    fontSize: '0.75rem',
    lineHeight: '$shorter',
    fontWeight: '$bold',
    
    borderRadius: '0px 4px 0px 4px'


})
