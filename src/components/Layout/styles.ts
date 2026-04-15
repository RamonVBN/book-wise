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
  },
});

export const MainContainer = styled("main", {
  width: "100%",
  display: "flex",
  justifyContent: "center",

  overflowY: "hidden",
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
  overflow: "hidden",

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
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    borderRadius: "0px",

    width: "100vw",
    paddingBlock: "3rem",
  },
});

export const MenuNavigation = styled("nav", {
  marginTop: "4rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  height: "100%",

  div: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  "@media(max-width: 900px)": {
    gap: "3rem",

    div: {
      flexDirection: "row",
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

  "@media(min-width: 900px)": {
    "&::before": {
      content: "",
      width: "0.25rem",
      height: "1.5rem",
      borderRadius: "999px",
      backgroundImage: "transparent",
    },
  },

  "@media(max-width: 900px)": {
    flexDirection: "column",

    "&::after": {
      content: "",
      width: "100%",
      height: "0.25rem",
      borderRadius: "999px",
      backgroundImage: "transparent",
    },
  },
});

export const SignInButtonContainer = styled("span", {
  display: "flex",
  gap: "0.25rem",
  alignItems: "center",
  

  marginTop: "auto",

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

  '&:disabled': {
    cursor: 'progress',
    opacity: 0.8
  },

  svg: {
    color: "$red100",
  },
});

export const DemoBanner = styled('div', {

  position: 'fixed',
  top: 0,
  right: 0,
  backgroundColor: '$blue100',
  color: '$gray200'
})
