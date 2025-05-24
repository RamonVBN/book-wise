import { styled } from "../../pages/globalStyles"


export const Container = styled('div', {
    display: 'flex',
    flexDirection: 'column'
    
})

export const ProfileContainer = styled('div', {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '6rem',
})

export const ProfileMainContainer = styled('div', {

    display: 'flex',
    flexDirection: 'column'

})

export const ProfileForm = styled('form', {

    width: '100%',
    display: 'flex',
    justifyContent: 'stretch',

    label: {
        width: '100%',
        backgroundColor: '$gray800',
        borderTop: '1px solid $gray500',
        borderLeft: '1px solid $gray500',
        borderBottom: '1px solid $gray500',
        borderRadius: '4px 0px 0px 4px',
    
        padding: '0.875rem 1.25rem',

        display: 'flex',
        alignItems: 'center'
    },

    marginBottom: '3rem'


})

export const ProfileInput = styled('input', {
    all: 'unset',
    backgroundColor: 'transparent',
    color: '$gray400',

    width: '100%',

    '&::placeholder': {
        color: '$gray400'
    }
})

export const ProfileButton = styled('button', {
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

export const UserContainer = styled('div', {

    width: '20.25rem',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',

    borderLeft: '1px solid $gray700'
})

export const UserProfile = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',

    alignItems: 'center',

    img: {
        width: '4.5rem',
        height: '4.5rem',

        borderRadius: '999px'
    },

    span: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',

        h2: {
            fontSize: '1.25rem',
            color: '$gray100',
            lineHeight: '$short',
            fontWeight: '$bold'
        },

        span: {
            fontSize: '0.875rem',
            fontWeight: '$regular',
            lineHeight: '$base',
            color: '$gray400'
        }
    }
    
})

export const UserSeparator = styled('span', {
    width: '2rem',
    height: '0.25rem',

    borderRadius: '999px',

    backgroundImage: '$gradient-horizontal'
})

export const UserStatsContainer = styled('div', {

    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
    padding: '1.25rem 3.5rem',

})

export const UserStats = styled('div', {
    width: '100%',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '1.25rem',

    svg: {
        width: '2rem',
        height: '2rem',
        
        color: '$green100'
    },

    span: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '0.25rem',

        h3: {
            fontWeight: '$bold',
            fontSize: '1rem',
            lineHeight: '$short',
            color: '$gray200',
        },

        span: {
            fontSize: '0.875rem',
            fontWeight: '$regular',
            lineHeight: '$base',
            color: '$gray300'
        }
    }

})

export const RatedBooksContainer = styled('div', {
    
    display: 'flex',
    flexDirection: 'column',
    width: '38rem',

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

   
})

export const RatedBookTime = styled('span', {

    fontSize: '0.875rem',
    fontWeight: '$regular',
    lineHeight: '$base',
    color: '$gray300',
})