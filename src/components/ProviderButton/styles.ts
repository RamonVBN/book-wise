import { styled } from "@/pages/globalStyles";

export const ProviderButton = styled("button", {
  all: "unset",
  cursor: "pointer",
  boxSizing: "border-box",

  width: "100%",
  borderRadius: 8,
  backgroundColor: "$gray600",
  padding: "1.25rem 1.5rem",

  display: "flex",
  alignItems: "center",
  gap: "1.25rem",

  color: "$gray200",
  fontSize: "1.125rem",
  fontWeight: "$bold",
  lineHeight: "$base",
  transition: "all 0.2s ease-out",

  svg: {
    width: "2rem",
    height: "2rem",
    color: "$purple100",
  },

  "&:hover": {
    backgroundColor: "$gray500",
  },


});
