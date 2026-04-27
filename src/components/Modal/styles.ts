import { styled } from "@/pages/globalStyles";

export const ModalOverlay = styled("div", {
  position: "fixed",
  zIndex: 11,
  top: 0,
  right: 0,

  width: "100vw",
  height: "100vh",

  backgroundColor: "rgba(0, 0, 0, 0.3)",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const ModalContainer = styled("div", {
  position: "relative",

  padding: "3.5rem 4.5rem",
  borderRadius: "12px",
  backgroundColor: "$gray700",

  maxWidth: "32.25rem",

  boxShadow: `
  0px 10px 38px rgba(0, 0, 0, 0.45),
  0px 10px 20px rgba(0, 0, 0, 0.25)
`,

  h3: {
    fontWeight: "$bold",
    fontSize: "1rem",
    lineHeight: "$short",
    color: "$gray200",
    textAlign: "center",
  },

  "& > button:has(svg)": {
    position: "absolute",
    top: 16,
    right: 16,
  },
});
