import { styled } from "@/pages/globalStyles";

export const ExploreContainer = styled('div', {
    
    display: 'flex',
    flexDirection: 'column',
    flex: '0 1 83.5rem',

    overflowY: 'scroll',
    scrollbarWidth: 'none',
    
    borderBottom: '1px solid $gray600',
    paddingBottom: '1.25rem',

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


export const ExplorePageFallback = styled('div', {

    width: '100%',

    padding: '8rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',

    fontSize: '1rem',
    color: '$gray400',

    svg: {
        color: '$gray400',
        width: '3rem',
        height: '3rem'
    }
})


export const CategoriesContainer = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.75rem",
});

export const Category = styled("button", {
  all: "unset",
  cursor: "pointer",
  padding: "0.25rem 1rem",

  borderRadius: "999px",

  fontSize: "1rem",
  fontWeight: "$regular",
  lineHeight: "$base",

  "&:disabled": {
    cursor: "progress",
    opacity: 0.8,
  },

  transition: "all 0.1s ease-out",

  variants: {
    isActive: {
      true: {
        color: "$gray100",
        backgroundColor: "$purple200",
        border: "1px solid $purple200",

        "&:hover": {
          border: "1px solid $purple100",
        },
      },

      false: {
        color: "$purple100",
        border: "1px solid $purple100",

        "&:hover": {
          color: "$gray100",
          backgroundColor: "$purple200",
        },
      },
    },
  },

  defaultVariants: {
    isActive: "false",
  },
});

