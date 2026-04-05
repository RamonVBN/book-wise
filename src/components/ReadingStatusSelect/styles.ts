import { styled } from "@/pages/globalStyles"
import * as Select from "@radix-ui/react-select"


export const Trigger = styled(Select.Trigger, {
  all: "unset",

  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  padding: "8px 12px",

  borderRadius: "$full",
  border: "1px solid $gray600",

  backgroundColor: "$gray800",
  color: "$gray100",

  fontSize: "14px",
  fontWeight: '$medium',

  cursor: "pointer",

  "&:hover": {
    borderColor: "$gray500",
  },

  "&:focus": {
    borderColor: "$blue500",
  },

  variants: {
    status: {
      WANT_TO_READ: {
        backgroundColor: "#2563EB",
        color: "$gray100",
      },

      READING: {
        backgroundColor: "#D4AF37",
        color: "$gray100",
      },

      FINISHED: {
        backgroundColor: "#10B981",
        color: "$gray200",
      },

      ABANDONED: {
        backgroundColor: "#222222",
        color: "$gray100",
      },
    },

    disabled: {
      true: {
        cursor: 'progress',
        opacity: 0.9,
      }
    }
  },

})

export const Content = styled(Select.Content, {
  zIndex: 9999,
  overflow: "hidden",

  backgroundColor: "$gray800",
  borderRadius: "10px",

  border: "1px solid $gray600",

  boxShadow:
    "0px 10px 38px rgba(0,0,0,0.35), 0px 10px 20px rgba(0,0,0,0.2)",
})

export const Item = styled(Select.Item, {
  fontSize: "14px",

  padding: "8px 12px",

  color: "$gray100",

  display: "flex",
  alignItems: "center",
  gap: '0.5rem',

  cursor: "pointer",

  svg: {
    color: '$green100',
    width: '1.5rem',
    height: '1.5rem'
  },

  "&[data-highlighted]": {
    backgroundColor: "$gray700",
  },
})

