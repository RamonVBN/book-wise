import { styled } from "@/pages/globalStyles";

export const FavoriteButtonComponent = styled("button", {
  all: "unset",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  borderRadius: "$full",
  padding: "$2",

  transition: "all 0.2s ease-out",

  "&:not(:disabled):hover": {
    backgroundColor: "$gray500",
  },

  "&:disabled": {
    cursor: "progress",
    opacity: 0.5,
  },

  svg: {
    width: "1.5rem",
    height: "1.5rem",
    color: "$green100",
  },
});
