import { styled } from "@/pages/globalStyles";

export const FallbackContainer = styled('div', {

    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    h2: {
        color: '$gray100',
        fontWeight: '$medium',
        fontSize: '1.5rem',
        lineHeight: '$short',
    }
})