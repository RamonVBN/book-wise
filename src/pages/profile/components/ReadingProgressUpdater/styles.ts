import { styled } from "@/pages/globalStyles";

export const ReadingProgressUpdaterContainer = styled("div", {
  display: "flex",
  flexDirection: "column",

  color: "$gray100",

  marginTop: "1rem",
  gap: "0.5rem",
  padding: "0.75rem",
  borderRadius: "12px",
  backgroundColor: "$gray800",
});

export const InputRow = styled("form", {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

export const PageInput = styled("input", {
  width: "70px",
  padding: "0.25rem 0.4rem",
  borderRadius: "6px",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "transparent",
  color: "inherit",
  fontSize: "0.9rem",

  outline: "none",
  
  "&:focus": {
    border: '1px solid $green200',
  }
  
});

export const TotalPagesText = styled("span", {
  fontSize: "0.8rem",
});

export const SaveButton = styled("button", {
  all : "unset",

  marginLeft: "auto",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  borderRadius: "$full",
  padding: "$2",

  "&:not(:disabled):hover": {
    backgroundColor: "$gray500",
  },

  svg: {
    width: "1.5rem",
    height: "1.5rem",
    color: "$green100",
  },
});

export const IncrementContainer = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.25rem",
});

export const IncrementButton = styled("button", {
  color: "$gray100",

  fontSize: "0.75rem",
  padding: "0.25rem 0.45rem",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.12)",
  backgroundColor: "$purple200",
  cursor: "pointer",

  transition: "0.2s",

  "&:hover": {
    border: '1px solid $purple100',
  },
});