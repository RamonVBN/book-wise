import { styled } from "@stitches/react";

export const Container = styled("main", {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  gap: "1rem",
  padding: "2rem",

  backgroundColor: "$gray700",
});

export const Code = styled("h1", {
  fontSize: "4rem",
  fontWeight: "bold",
  color: "$red100",
});

export const Message = styled("p", {
  fontSize: "1.1rem",
  opacity: 0.7,
  color: "$gray100",
});