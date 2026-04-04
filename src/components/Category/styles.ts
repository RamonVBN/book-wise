import { styled } from "@/pages/globalStyles";

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
