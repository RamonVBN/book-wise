import { styled } from "@/pages/globalStyles";
import Image from "next/image";

export const AvatarContainer = styled("div", {
  $$width: "72px",
  $$height: "72px",
  $$borderWidth: "1px",
  $$gradient: "linear-gradient(135deg, #7FD1CC, #9694F5)",

  width: "$$width",
  height: "$$height",

  borderRadius: "100%",
  display: "inline-block",
  cursor: 'pointer',

  border: "$$borderWidth solid transparent",

  background: `
     padding-box,
    $$gradient border-box
  `,

  overflow: "hidden",
  boxSizing: "border-box"
})

export const AvatarInner = styled("div", {
  width: "100%",
  height: "100%",
  borderRadius: "100%",
  overflow: "hidden",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})


export const AvatarImage = styled(Image, {
  width: '100%',
  height: '100%',
  borderRadius: "100%",
  objectFit: "cover",
  display: "block",
});

export const AvatarFallback = styled("span", {
  fontSize: "1.25rem",
  fontWeight: '$bold',
  color: "$white",
})