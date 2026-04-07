import { styled } from "@/pages/globalStyles";

export const ProviderButton = styled("button", {
  all: "unset",
  cursor: "pointer",
  boxSizing: "border-box",

  width: "100%",
  borderRadius: 8,
  backgroundColor: "$gray800",
  padding: "1.25rem 1.5rem",

  display: "flex",
  alignItems: "center",
  gap: "1.25rem",

  color: "$gray200",
  fontSize: "1.125rem",
  fontWeight: "$bold",
  lineHeight: "$base",
  transition: "all 0.2s ease-out",

  "&:hover": {
    backgroundColor: "$gray700",
  },

  variants: {
    login: {
      true: {
        backgroundColor: "$gray600",
        "&:hover": {
          backgroundColor: "$gray500",
        },
      },
    },
  },
});