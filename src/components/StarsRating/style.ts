import { styled } from "@/pages/globalStyles";

export const Container = styled("div", {
  display: "flex",
  gap: "0.6rem",
  flexDirection: "row",
  color: "$purple100",

  "@media(max-width: 320px)": {
    flexDirection: "column",
  },
});

export const StarRatingContainer = styled("span", {
  color: "$purple100",
  display: "flex",
  gap: "0.25rem",
  flexDirection: "row",
});
