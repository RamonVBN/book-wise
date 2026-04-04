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
    paddingTop: '1rem',
    fontWeight: "$regular",
    fontSize: "0.875rem",
    lineHeight: "$base",
    color: "$gray100",
    textAlign: "justify",
  },

  '& > :first-child': {
    display: "flex",
    justifyContent: "space-between",
    gap: '1.5rem'
  },
});

export const ProfileBookInfo = styled("div", {
  display: "flex",
  gap: "1.5rem",

  img: {
    width: "6.125rem",
    height: "8.375rem",
  },

  div: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",

    "span:first-child": {
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",

      h2: {
        fontWeight: "$bold",
        fontSize: "1.125rem",
        lineHeight: "$short",
        color: "$gray100",
      },

      span: {
        fontWeight: "$regular",
        fontSize: "0.875rem",
        lineHeight: "$base",
        color: "$gray400",
      },
    },

  },
});

export const ProfileBookOptions = styled("div", {
  display: "flex",
  flexDirection: "column",

  '& > div:first-child': {
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    gap: "0.75rem",
  }

});

export const ProfileBookButton = styled("button", {
    all: "unset",
    
    width: "2.5rem",
    height: "2.5rem",
    boxSizing: "border-box",

    padding: "0.5rem",
    borderRadius: "$full",

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

})

export const ProfileBookTime = styled("span", {
  fontSize: "0.875rem",
  fontWeight: "$regular",
  lineHeight: "$base",
  color: "$gray300",
});

export const ModalBody = styled("div", {
  
  display: "flex",
  flexDirection: "column",
  justifyContent: 'center',
  alignItems: 'center',
  gap: "1.5rem",
  color: "$gray100",

  p: {
    fontWeight: "$bold",
    textAlign:'center'
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

      padding: "0.5rem",

      backgroundColor: "$gray800",
      borderRadius: "4px",

      "&:hover": {
        backgroundColor: "$gray700",
      },
    },

    "button:first-child": {
      backgroundColor: "#B91C1C",
      "&:hover": {
        backgroundColor: "#EF4444",
      },
    },
  },
});
