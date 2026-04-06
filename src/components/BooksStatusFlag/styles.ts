import { styled } from "@/pages/globalStyles";

export const StatusMark = styled("span", {
  

  fontSize: "0.75rem",
  lineHeight: "$shorter",
  fontWeight: "$bold",

  borderRadius: "0px 4px 0px 4px",

  variants: {
    status: {
      FINISHED: {
        svg: {
          color: "$green400",
          fill: "$green400",
        },
      },
      READING: {
        svg: {
          color: "$yellow100",
          fill: "$yellow100",
        },
      },
      WANT_TO_READ: {
        svg: {
          color: "$blue100",
          fill: "$blue100",
        },
      },
      ABANDONED: {
        svg: {
          color: "$red100",
          fill: "$red100",
        },
      },
    },

    explore: {
      true: {
        position: "absolute",
        top: -2,
        right: -2,
      }
    }
  },
});
