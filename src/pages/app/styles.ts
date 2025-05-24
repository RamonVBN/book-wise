import { styled } from "@stitches/react";

export const AppContainer = styled('div', {

    width: '100%',
    height: '100vh',
    backgroundColor: '#0E1116',
    padding: 20,

    display: 'flex',
})

export const MainContainer = styled('main', {

    // width: 'calc(100% - 232px)'
    width: '100%',
    maxHeight: '100%',


    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden'

    
})

export const MenuContainer = styled('div', {

    // height: 'calc(100vh - 40px)',
    
    flexBasis: '16rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    backgroundColor: '$gray700',
    borderRadius: '10px',

    paddingTop: '3rem',
    paddingBottom: '1.5rem'


})

export const MenuNavigation = styled('nav', {

    marginTop: '4rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
})

export const NavButton = styled('button', {

    all: 'unset',
    cursor: 'pointer',
    display: 'flex',
    gap: '0.75rem',

    
    fontSize: '1rem',
    lineHeight: '$base',

    transition: 'all 0.2s ease-in',

    '&::before': {
        content: '',
        width: '0.25rem',
        height: '1.5rem',
        borderRadius: '999px',
        backgroundImage: 'transparent'
    },

    '&:hover': {
        color: '$gray100'
    },
    
    variants: {

        isActive: {

            true: {
                color: '$gray100',
                fontWeight: '$medium',

                '&::before': {
                    backgroundImage: '$gradient-vertical'
                }
            },

            false: {
                color: "$gray400",
                fontWeight: '$regular'
            }
        }
    },

    defaultVariants: {
        isActive: 'false'
    }

})

export const SignInButton = styled('button', {

    all: 'unset',
    cursor: 'pointer',
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',

    marginTop: 'auto',

    fontWeight: '$bold',
    fontSize: '1rem',
    lineHeight: '$base',
    color: '$gray200',

    svg: {
        color: '$green100'
    },

})

export const SignOutButton = styled('button', {

    
    all: 'unset',
    cursor: 'pointer',
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',

    marginTop: 'auto',

    fontWeight: '$regular',
    fontSize: '1rem',
    lineHeight: '$base',
    color: '$gray200',

    img: {
        borderRadius: '999px',
        width: '2rem',
        height: '2rem',    
    },

    svg: {
        color: '#F75A68'
    }

})

