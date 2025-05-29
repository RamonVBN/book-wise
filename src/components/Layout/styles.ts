import { styled } from "@/pages/globalStyles"
import Link from "next/link"

export const AppContainer = styled('div', {

    width: '100%',
    height: '100vh',
    backgroundColor: '#0E1116',
    padding: '1.25rem',

    display: 'flex',

    '@media(max-width: 900px)': {
        flexDirection: 'column',

    }
})

export const MainContainer = styled('main', {

    // width: 'calc(100% - 232px)'
    width: '100%',
    maxHeight: '100%',

    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',

    
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
    paddingBottom: '1.5rem',
    marginRight: '3rem',

    '@media(max-width: 900px)': {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
        borderRadius: '0px',

        width: '100vw',
        paddingBlock: '3rem',

    }

})

export const MenuNavigation = styled('nav', {

    marginTop: '4rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    height: '100%',

    div: {

        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',

    },

    
    '@media(max-width: 900px)': {
    //    display: 'none'
        // position: 'absolute',
        // flexDirection: 'row',
        // alignItems: 'flex-start',
        gap: '3rem',
        

        div: {
            flexDirection: 'row',
        },

        
    }
})

export const NavButton = styled(Link, {

    all: 'unset',
    cursor: 'pointer',
    display: 'flex',
    gap: '0.75rem',

    
    fontSize: '1rem',
    lineHeight: '$base',

    transition: 'all 0.2s ease-in',
    

    '&:hover': {
        color: '$gray100'
    },

    'span:first-child': {
        display:'flex',
        gap: '0.75rem',
    },
    
    variants: {

        isActive: {

            true: {
                color: '$gray100',
                fontWeight: '$medium',

                '&::before': {
                    backgroundImage: '$gradient-vertical'
                },

                '&::after': {
                    backgroundImage: '$gradient-horizontal'
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
    },

    '@media(min-width: 900px)': {

        '&::before': {
            content: '',
            width: '0.25rem',
            height: '1.5rem',
            borderRadius: '999px',
            backgroundImage: 'transparent'
    },
    },

    '@media(max-width: 900px)': {

        flexDirection: 'column',
        
        '&::after': {
            content: '',
            width: '100%',
            height: '0.25rem',
            borderRadius: '999px',
            backgroundImage: 'transparent'
        },
    }

})

export const SignInButton = styled(Link, {

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

