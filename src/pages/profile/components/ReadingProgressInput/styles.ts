import { styled } from "@stitches/react";

// Container principal
export const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  width: "100%",
});

// Label superior
export const Label = styled("div", {
  fontSize: "0.85rem",
  fontWeight: 500,
  opacity: 0.75,
});

// Container barra + número
export const ProgressRow = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

// Barra base
export const BarBackground = styled("div", {
  flex: 1,
  height: "10px",
  borderRadius: "999px",
  backgroundColor: "#2A2A2A",
  overflow: "hidden",
});

// Barra preenchida
export const BarFill = styled("div", {
  height: "100%",
  borderRadius: "999px",
  transition: "width 0.25s ease",

  variants: {
    color: {
      green: {
        backgroundColor: "#10B981",
      },
      yellow: {
        backgroundColor: "#FACC15",
      },
      blue: {
        backgroundColor: "#3B82F6",
      },
    },
  },

  defaultVariants: {
    color: "green",
  },
});

// Input numérico
export const Input = styled("input", {
  width: "60px",
  borderRadius: "8px",
  border: "1px solid #3A3A3A",
  background: "#1E1E1E",
  color: "white",
  padding: "4px 6px",
  fontSize: "0.8rem",
  outline: "none",

  "&:focus": {
    borderColor: "#10B981",
  },
});

// Slider
export const Slider = styled("input", {
  width: "100%",
  appearance: "none",
  height: "6px",
  borderRadius: "999px",
  background: "#2A2A2A",
  outline: "none",
  cursor: "pointer",

  "&::-webkit-slider-thumb": {
    appearance: "none",
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    background: "#10B981",
  },
});