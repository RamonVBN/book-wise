import { styled } from "@/pages/globalStyles";

export const ProfileBooksContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  maxWidth: "38rem",

  maxHeight: "42rem",
  overflowY: "scroll",
  scrollbarWidth: "none",

  gap: "0.75rem",
});

export const ProfileBook = styled("div", {
  display: "flex",
  flexDirection: "column",
  padding: "1.5rem",

  marginBottom: "1rem",
  marginTop: "0.5rem",

  width: "100%",
  backgroundColor: "$gray700",
  borderRadius: "8px",

  p: {
    paddingTop: "1rem",
    fontWeight: "$regular",
    fontSize: "0.875rem",
    lineHeight: "$base",
    color: "$gray100",
    textAlign: "justify",
  },

  "& > div:first-child": {
    display: "flex",
    justifyContent: "space-between",
    gap: "1.5rem",

    "@media(max-width: 500px)": {
      flexDirection: "column",
    },
  },

  transition: "box-shadow 400ms ease, background-color 400ms ease",

  variants: {
    dragging: {
      true: {
        boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
      },
    },
  },
});

export const ProfileBookInfo = styled("div", {
  display: "flex",
  flexWrap: "nowrap",
  gap: "0.75rem",

  "& > div:first-child": {
    display: "flex",
    alignItems: "center",
    button: {
      touchAction: "none",
    },

    "@media(max-width: 320px)": {
      marginInline: 'auto'
    }

  },

  "& > div:last-child": {
    display: "flex",
    gap: "1.5rem",

    img: {
      width: "6.125rem",
      height: "8.375rem",
      objectFit: "cover",
      borderRadius: "6px",
      flexShrink: 0,
    },

    "& > div": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",

      "& > span:first-child": {
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",

        h2: {
          fontWeight: "$bold",
          fontSize: "1.125rem",
          lineHeight: "$short",
          color: "$gray100",

          "@media(max-width: 425px)": {
            fontSize: "1rem",
          },
        },

        span: {
          fontWeight: "$regular",
          fontSize: "0.875rem",
          lineHeight: "$base",
          color: "$gray400",
        },
      },
    },

    
  },

  "@media(max-width: 320px)": {
    flexWrap: 'wrap',
  }
});

export const ProfileBookOptions = styled("div", {
  display: "flex",
  flexDirection: "column",

  "& > div:first-child": {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "0.75rem",
  },

  "@media(max-width: 500px)": {
    alignSelf: "center",
  },
});

export const ProfileBookButton = styled("button", {
  all: "unset",

  width: "2.5rem",
  height: "2.5rem",
  boxSizing: "border-box",

  padding: "0.5rem",
  borderRadius: "$full",

  transition: "all 0.2s ease-out",

  svg: {
    color: "$green100",
    width: "1.5rem",
    height: "1.5rem",
  },

  "&:not(:disabled)": {
    cursor: "pointer",
  },

  "&:not(:disabled):hover": {
    backgroundColor: "$gray500",
  },

  variants: {
    isLoading: {
      true: {
        cursor: "progress",
        opacity: 0.5,
      },
    },

    isRating: {
      true: {
        svg: {
          color: "$purple100",
          width: "1.5rem",
          height: "1.5rem",
        },
      },
    },
  },
});

export const ProfileBookTime = styled("span", {
  fontSize: "0.875rem",
  fontWeight: "$regular",
  lineHeight: "$base",
  color: "$gray300",
});

export const ModalBody = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "1.5rem",
  color: "$gray200",

  p: {
    fontWeight: "$bold",
    textAlign: "center",
  },

  div: {
    display: "flex",
    flexDirection: "row",
    gap: "0.75rem",

    button: {
      display: "flex",
      justifyItems: "center",
      alignItems: "center",

      all: "unset",
      cursor: "pointer",
      height: "3rem",
      boxSizing: "border-box",

      transition: "all 0.2s ease-out",

      padding: "0.5rem",

      backgroundColor: "$gray700",
      borderRadius: "4px",

      "&:hover": {
        backgroundColor: "$gray500",
      },
    },

    "button:first-child": {
      backgroundColor: "$red200",
      "&:hover": {
        backgroundColor: "$red100",
      },
    },
  },
});

export const AddedBookFlag = styled("span", {
  display: "flex",
  gap: "0.5rem",
  alignItems: "center",
  svg: {
    color: "$green100",
  },
});
