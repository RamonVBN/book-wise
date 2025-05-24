import { styled } from "@/pages/globalStyles";


export const PageHeader = styled('div', {

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