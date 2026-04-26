import { styled } from "@/pages/globalStyles";

export const AddBookOverlayContainer = styled("div", {
  position: "relative",
  height: "min-content",
  
});

export const AddBookOverlay = styled("div", {
  position: "absolute",
  width: "100%",
  height: "100%",
  zIndex: 10,
  borderRadius: "6px",

  backgroundColor: "transparent",
  transition: "all 250ms ease-out",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  svg: {
    zIndex: 11,
    opacity: 0,
    color: "$green100",
    cursor: "pointer",
    transition: 'all 250ms ease-out'
  },

  "&:hover": {
    backgroundColor: '#0e1116d5',
    svg: {
      opacity: 100,
    },
  },
});

export const AddBookButtonContainer = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
});

export const AddBookButton = styled("button", {
  all: "unset",

  width: "2.25rem",
  height: "2.25rem",
  boxSizing: "border-box",

  borderRadius: "$full",

  transition: "all 0.2s ease-out",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  svg: {
    color: "$green100",
    width: "1.5rem",
    height: "1.5rem",
  },

  "&:not(:disabled)": {
    cursor: "pointer",
  },

  "&:not(:disabled):hover": {
    backgroundColor: "$gray500",
  },
});

export const CloseButton = styled("button", {
  all: "unset",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  opacity: 0.7,

  "&:hover": {
    opacity: 1,
  },
});
