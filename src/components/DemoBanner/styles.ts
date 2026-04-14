import { styled } from "@/pages/globalStyles";

export const BannerContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  padding: "10px 16px",
  fontSize: "0.875rem",
  borderBottom: "1px solid",

  borderRadius: "6px 0px 0px 6px",

  position: "fixed",
  top: 0,
  right: 0,
  zIndex: 999,

  transition: "all 0.2s ease-out",

  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.10)",
 

  "&": {
    animation: "fadeIn 0.2s ease-in-out",
  },

  variants: {
    variant: {
      demo: {
        background: "$gradient-horizontal",
        color: "$black",
      },
    },
  },

  defaultVariants: {
    variant: "demo",
  },
});

export const BannerContent = styled("div", {
  display: "flex",
  gap: "8px",
  alignItems: "center",
  fontWeight: "$medium",
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

export const DemoBannerButton = styled("button", {
  all: "unset",
  cursor: "pointer",
  backgroundColor: "$red100",
  padding: "4px",
  borderRadius: "6px",
  color: "$white",
  fontWeight: "$medium",

  transition: "all 0.2s ease-out",

  "&:hover": {
    opacity: 0.8,
  },
});

export const Badge = styled("span", {
  fontWeight: "$bold",
  color: "$purple200",
});
