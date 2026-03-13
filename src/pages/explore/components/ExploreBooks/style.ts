import { styled } from "@/pages/globalStyles";

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

    height: '11.5rem',

    '&:hover': {
        border: '2px solid $gray600',
    },

    img: {
        borderRadius: '0.25rem',
        height: 'auto',
        width: 'auto',
    },

    div: {

        display:'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',

        'span:first-child': {

            h2: {
                fontSize: '1rem',
                fontWeight: '$bold',
                lineHeight: '$short',
                color: '$gray100',
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
            },

            span: {
                fontSize: '0.875rem',
                fontWeight: '$regular',
                lineHeight: '$base',
                color: '$gray400',
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
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
