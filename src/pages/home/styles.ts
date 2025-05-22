import { all } from "axios";
import { styled } from "../globalStyles";


export const HomeContainer = styled('div', {

    maxWidth: '100%',
    minHeight: '100vh',
    backgroundColor: '#0E1116',
    padding: 20,

    display: 'flex',
    justifyContent: 'space-evenly'


})

export const MenuContainer = styled('div', {

    height: 'calc(100vh - 40px)',

    flexBasis: '14.5rem',
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

export const MainContainer = styled('main', {
    display: 'flex',
    gap: '6rem',

})

export const MainHeader = styled('div', {

    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBlock: '3rem',

    h1: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    color: '$gray100',
    lineHeight: '$short',
   },

    svg: {
        color: '$green100',
        width: '2rem',
        height: '2rem'
    }
})

export const MainBody = styled('div', {
  
})

export const BooksRatingsContainer = styled('div', {

    display: 'flex',
    flexDirection: 'column',
    width: '38rem',
    
    gap: '0.75rem'

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

export const BookRatingHeader = styled('div', {

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

export const MainAside = styled('aside', {
    marginTop: '6rem',
    width: 324,
    height: 556,

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
        }
    }

})

export const MainAsideBody = styled('div', {
    
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


export const ProfileContainer = styled('div', {

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',

    borderLeft: '1px solid $gray700'
})

export const ProfileUser = styled('div', {
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

export const ProfileSeparator = styled('span', {
    width: '2rem',
    height: '0.25rem',

    borderRadius: '999px',

    backgroundImage: '$gradient-horizontal'
})

export const ProfileStatsContainer = styled('div', {

    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
    padding: '1.25rem 3.5rem',

})

export const ProfileStats = styled('div', {
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

export const RatedBook = styled('div', {

    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    padding: '1.5rem',

    marginBlock: '1rem',

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



