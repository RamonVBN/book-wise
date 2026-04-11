import { styled } from "@/pages/globalStyles"
import { keyframes } from "@stitches/react"
import Image from "next/image"

export const shimmer = keyframes({
  "0%": {
    backgroundPosition: "200% 0"
  },
  "100%": {
    backgroundPosition: "-200% 0"
  }
})

export const CoverContainer = styled("div", {
  position: "relative",
  width: "$$width",
  height: "$$height",
  borderRadius: "8px",
  backgroundColor: "$gray700"
})

export const Skeleton = styled("div", {
  position: "absolute",
  inset: 0,
  borderRadius: '5px',

  background: `
    linear-gradient(
      90deg,
      $colors$gray700 25%,
      $colors$gray600 37%,
      $colors$gray700 63%
    )
  `,

  backgroundSize: "400% 100%",
  animation: `${shimmer} 1.4s ease infinite`
})

export const StyledImage = styled(Image, {
  objectFit: "cover",
  opacity: 0,
  transition: "opacity 180ms ease-out",
  width: '$$width',
  height: '$$height',
  borderRadius: '6px',

  variants: {
    loaded: {
      true: {
        opacity: 1
      }
    }
  }
})
