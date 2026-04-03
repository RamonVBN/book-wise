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
          color: "#10B981",
          fill: "#10B981",
        },
      },
      READING: {
        svg: {
          color: "#D4AF37",
          fill: "#D4AF37",
        },
      },
      WANT_TO_READ: {
        svg: {
          color: "#2563EB",
          fill: "#2563EB",
        },
      },
      ABANDONED: {
        svg: {
          color: "#222222",
          fill: "#222222",
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
