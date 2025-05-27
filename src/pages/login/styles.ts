
import homeImage from '../../../assets/homeImage.png'
import { styled } from '../globalStyles'



export const Container = styled('div', {

    maxWidth: '100%',
    minHeight: '100vh',
    backgroundColor: '#0E1116',
    padding: 20,

    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',

})

export const ImageContainer = styled('div', {
    width: '100%',
    height: '100%',
    backgroundImage: `url(${homeImage.src})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    borderRadius: '10px',

    position: 'relative',

    gridColumn: '1/3',

})

export const LogoFilter = styled('div', {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#2A2879',
    opacity: 0.90,

    borderRadius: '10px',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
})

export const AuthContainer = styled('div', {

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gridColumn: '3/6'

})

export const LoginContainer = styled('div', {

    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
    
    width: '23.25rem'

})

export const LoginContainerHeader = styled('div', {

    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',

    h1: {
        color: '#F8F9FC',
        fontWeight: '500',
        fontSize: '1.5rem',
        lineHeight: '140%',
    },

    p: {
        fontWeight: 'normal',
        fontSize: '1rem',
        lineHeight: '160%',
        color: '#E6E8F2'
    },

})

export const ProviderContainer = styled('div', {

    display: 'flex',
    flexDirection: 'column',

    gap: '1rem'
})

export const ProviderButton = styled('button', {
    all: 'unset',
    cursor: 'pointer',
    boxSizing: 'border-box',

    width: '100%',
    borderRadius: 8,
    backgroundColor: '#252D4A',
    padding: '1.25rem 1.5rem',
    
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',

    color: '#E6E8F2',
    fontSize: '1.125rem',
    fontWeight: '$bold',
    lineHeight: '$base',
    transition: 'all 0.2s ease-out',

    '&:hover': {
        backgroundColor: '#303F73',
    }

        
})