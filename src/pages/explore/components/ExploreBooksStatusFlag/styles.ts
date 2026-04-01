import { styled } from "@/pages/globalStyles";

export const StatusMark = styled('span', {

    position: 'absolute',
    top: -2,
    right: -2,

    padding: '0.25rem 0.75rem',

    fontSize: '0.75rem',
    lineHeight: '$shorter',
    fontWeight: '$bold',
    
    borderRadius: '0px 4px 0px 4px',

    variants: {
        status: {

            FINISHED: {
                backgroundColor: "#10B981",
                color: "$gray200",
            },
            READING: {
                backgroundColor: "#D4AF37",
                color: "$gray100",
            },
            WANT_TO_READ: {
                backgroundColor: "#2563EB",
                color: "$gray100",
            },
            ABANDONED: {
                backgroundColor: "#222222",
                color: "$gray100",
            }
        }
    }

})
