import { styled } from "@/pages/globalStyles";

export const ExploreBooksContainer = styled('div', {

    marginTop: '1.25rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.25rem',

    '@media(max-width: 1500px)': {
        gridTemplateColumns: 'repeat(3, 1fr)',

    },

    '@media(max-width: 1200px)': {
        gridTemplateColumns: 'repeat(2, 1fr)',

    },


    '@media(max-width: 425px)': {
        gridTemplateColumns: 'repeat(1, 1fr)',

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
        borderRadius: '8px',
        height: '9.5rem',
        width: '6.75rem',
        objectFit: 'cover',
        flexShrink: 0,
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
            width: '100%'
        }

    },

    '@media(max-width: 900px)': {
        justifySelf: 'center',
        width: '100%'
    }

})

