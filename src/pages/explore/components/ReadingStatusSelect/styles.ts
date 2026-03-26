import { styled } from "@/pages/globalStyles"
import * as Select from "@radix-ui/react-select"


export const Trigger = styled(Select.Trigger, {
  all: "unset",

  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  padding: "8px 12px",

  borderRadius: "10px",
  border: "1px solid $gray600",

  backgroundColor: "$gray800",
  color: "$gray100",

  fontSize: "14px",

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
        borderColor: "$blue500",
        color: "$blue400",
      },

      READING: {
        borderColor: "$yellow500",
        color: "$yellow400",
      },

      FINISHED: {
        backgroundColor: "$green200",
        color: "$green400",
      },

      ABANDONED: {
        borderColor: "$red500",
        color: "$red400",
      },
    },
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
  justifyContent: "space-between",

  cursor: "pointer",

  "&[data-highlighted]": {
    backgroundColor: "$gray700",
  },
})

