import { styled } from "@/pages/globalStyles";
import Link from "next/link";

export const AppContainer = styled("div", {
  width: "100%",
  height: "100vh",
  backgroundColor: "#0E1116",
  padding: "1.25rem",

  display: "flex",

  "@media(max-width: 900px)": {
    flexDirection: "column",
    overflowY: "auto",
    width: "100%",
    minHeight: "100vh",
    padding: 0,
  },
});

export const MainContainer = styled("main", {
  width: "100%",
  display: "flex",
  justifyContent: "center",

  overflowY: "hidden",

  "@media(max-width: 900px)": {
    overflowY: "initial",
    padding: "1.25rem",
  },
});

export const MenuContainer = styled("div", {
  flexBasis: "16rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  borderRadius: "10px",

  paddingTop: "3rem",
  paddingBottom: "1.5rem",
  marginRight: "3rem",

  position: "relative",
  backgroundColor: "#0B1120",
  // overflow: "hidden",

  "&::before": {
    content: "",
    position: "absolute",
    inset: 0,

    background: `
      radial-gradient(circle at 30% 5%, rgba(129,140,248,0.40), transparent 45%),
      radial-gradient(circle at 75% 10%, rgba(168,85,247,0.35), transparent 50%),
      radial-gradient(circle at 20% 55%, rgba(56,189,248,0.25), transparent 55%),
      radial-gradient(circle at 40% 90%, rgba(16,185,129,0.20), transparent 50%)
    `,

    filter: "blur(160px)",
    opacity: 0.75,
    zIndex: 0,
  },

  "& > *": {
    position: "relative",
    zIndex: 1,
  },

  "@media(max-width: 900px)": {
    borderRadius: "0px",
    marginRight: 0,

    width: "100vw",
    paddingBlock: "3rem",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingInline: "1.5rem",
    maxHeight: "8.5rem",
  },
});

export const MenuNavigation = styled("nav", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",

  paddingTop: "4rem",

  height: "100%",

  div: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  transition: "transform 250ms ease-out",

  "@media(max-width: 900px)": {
    paddingBlock: "1rem",
    overflow: "hidden", 

    position: "fixed",
    zIndex: 1000,
    top: 0,
    left: 0,
    transform: "translateX(-100%)",

    width: "70dvw",
    height: "100dvh",

    backgroundColor: "#0B1120",

    "&::before": {
      content: "",
      position: "absolute",
      inset: 0,

      background: `
      radial-gradient(circle at 30% 5%, rgba(129,140,248,0.40), transparent 45%),
      radial-gradient(circle at 75% 10%, rgba(168,85,247,0.35), transparent 50%),
      radial-gradient(circle at 20% 55%, rgba(56,189,248,0.25), transparent 55%),
      radial-gradient(circle at 40% 90%, rgba(16,185,129,0.20), transparent 50%)
    `,

      filter: "blur(160px)",
      opacity: 0.75,
      zIndex: 0,
    },

    "& > *": {
      position: "relative",
      zIndex: 1,
    },
  },

  variants: {
    open: {
      true: {
        "@media(max-width: 900px)": {
          transform: "translateX(0)",
        },
      },
    },
  },
});

export const MenuNavigationOverlay = styled("div", {
  height: "100%",

  "@media(max-width: 900px)": {
    position: "fixed",
    top: 0,
    right: 0,
    zIndex: 1000000,
    overflow: "hidden",

    width: "100dvw",
    height: "100dvh",

    pointerEvents: "none",
    backgroundColor: "rgba(0,0,0,0)",
    transition: "background-color 200ms ease-out",
  },

  variants: {
    open: {
      true: {
        "@media(max-width: 900px)": {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          transform: "translateX(0)",
          pointerEvents: "all",
        },
      },
    },
  },
});
export const NavButton = styled(Link, {
  all: "unset",
  cursor: "pointer",
  display: "flex",
  gap: "0.75rem",

  fontSize: "1rem",
  lineHeight: "$base",

  transition: "all 0.2s ease-in",

  "&:hover": {
    color: "$gray100",
  },

  "span:first-child": {
    display: "flex",
    gap: "0.75rem",
  },

  variants: {
    isActive: {
      true: {
        color: "$gray100",
        fontWeight: "$medium",

        "&::before": {
          backgroundImage: "$gradient-vertical",
        },

        "&::after": {
          backgroundImage: "$gradient-horizontal",
        },
      },

      false: {
        color: "$gray400",
        fontWeight: "$regular",
      },
    },
  },

  defaultVariants: {
    isActive: "false",
  },

  "&::before": {
    content: "",
    width: "0.25rem",
    height: "1.5rem",
    borderRadius: "999px",
    backgroundImage: "transparent",
  },
});

export const SignInButtonContainer = styled("span", {
  marginTop: "auto",

  display: "flex",
  gap: "0.25rem",
  alignItems: "center",

  fontWeight: "$bold",
  fontSize: "1rem",
  lineHeight: "$base",
  color: "$gray200",
});

export const SignInButton = styled(Link, {
  all: "unset",
  cursor: "pointer",
  display: "flex",
  gap: "0.75rem",
  alignItems: "center",

  transition: "all 0.2s ease-out",

  padding: "$2",
  borderRadius: "$full",

  "&:hover": {
    backgroundColor: "$gray500",
  },

  svg: {
    color: "$green100",
  },
});

export const SignOutButtonContainer = styled("span", {
  marginTop: "auto",

  fontWeight: "$regular",
  fontSize: "1rem",
  lineHeight: "$base",
  color: "$gray200",

  display: "flex",
  gap: "0.25rem",
  alignItems: "center",

  "& > :first-child": {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
  },

  img: {
    borderRadius: "$full",
    width: "2rem",
    height: "2rem",
  },
});

export const SignOutButton = styled("button", {
  all: "unset",
  cursor: "pointer",

  transition: "all 0.2s ease-out",

  display: "flex",
  alignItems: "center",

  padding: "$2",
  borderRadius: "$full",

  "&:not(:disabled):hover": {
    backgroundColor: "$gray500",
  },

  "&:disabled": {
    cursor: "progress",
    opacity: 0.8,
  },

  svg: {
    color: "$red100",
  },
});

export const DemoBanner = styled("div", {
  position: "fixed",
  top: 0,
  right: 0,
  backgroundColor: "$blue100",
  color: "$gray200",
});

export const MenuButton = styled("button", {
  all: "unset",
  cursor: "pointer",
  zIndex: 1,
  svg: {
    color: "$green100",
  },
  padding: "0.5rem",
  borderRadius: "$full",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "all 0.2s ease-out",

  "&:hover": {
    backgroundColor: "$gray500",
  },

  "@media(min-width: 900px)": {
    display: "none",
  },
});
