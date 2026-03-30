import { styled } from "@/pages/globalStyles"

export const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
})

export const Label = styled("label", {
  fontSize: "14px",
  fontWeight: 500,
  color: "$gray11",
})

export const Row = styled("div", {
  display: "flex",
  alignItems: 'end',
  gap: "8px",
})

export const Input = styled("input", {
  width: "90px",
  padding: "6px 8px",
  borderRadius: "6px",
  border: "1px solid $gray600",
  backgroundColor: "$gray400",
  color: "$gray100",

  "&:focus": {
    outline: "none",
    borderColor: "$yellow8",
    boxShadow: "0 0 0 1px $yellow8",
  },
})

export const TotalPages = styled("span", {
  fontSize: "14px",
  color: "$gray100",
})

export const SaveButton = styled("button", {
  marginLeft: "6px",
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "$yellow9",
  color: "black",
  fontWeight: 500,
  cursor: "pointer",

  "&:hover": {
    backgroundColor: "$yellow10",
  },
})