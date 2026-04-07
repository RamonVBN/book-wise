import { styled } from "@/pages/globalStyles";

export const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: '100%',

  "@media(max-width: 900px)": {
    marginTop: "18rem",
    paddingInline: "2rem",
    overflow: "scroll",
    scrollbarWidth: "none",
  },
});

export const ProfileContainer = styled("div", {
  display: "flex",
  gap: "6rem",
  justifyContent: "center",

  flex: 1,
  minHeight: 0,
});

export const ProfileMainContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  flexBasis: "38rem",
  flexShrink: 1,
  // flexGrow: 1,
  minHeight: 0,

  "@media(max-width: 1236px)": {
    width: "100%",
  },
});

export const ProfileBooksContainer = styled("div", {
  display: "flex",
  flexDirection: "column",

  width: "100%",

  scrollbarWidth: "none",

  borderBottom: "1px solid $gray600",

  overflowY: "auto",
  minHeight: 0,
  flex: 1,
});

export const ProfileForm = styled("form", {
  width: "100%",
  display: "flex",

  label: {
    width: "100%",
    backgroundColor: "$gray800",
    borderTop: "1px solid $gray500",
    borderLeft: "1px solid $gray500",
    borderBottom: "1px solid $gray500",
    borderRadius: "4px 0px 0px 4px",

    padding: "0.875rem 1.25rem",

    display: "flex",
    alignItems: "center",
  },

  "&:has(input:focus)": {
    label: {
      borderColor: "$green200",
    },

    button: {
      borderColor: "$green200",
      svg: {
        color: "$green200",
      },
    },
  },

  paddingBottom: "1.5rem",
});

export const ProfileInput = styled("input", {
  all: "unset",
  backgroundColor: "transparent",
  color: "$gray400",

  width: "100%",

  "&::placeholder": {
    color: "$gray400",
  },
});

export const ProfileButton = styled("button", {
  all: "unset",
  cursor: "pointer",
  boxSizing: "border-box",

  borderTop: "1px solid $gray500",
  borderRight: "1px solid $gray500",
  borderBottom: "1px solid $gray500",
  padding: "0.875rem 1.25rem",
  borderRadius: "0px 4px 4px 0px",

  svg: {
    color: "$gray500",
    width: "1.25rem",
    height: "1.25rem",
  },
});

export const UserContainer = styled("div", {
  marginTop: '7.1rem',
  maxWidth: "20.25rem",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "2rem",

  borderLeft: "1px solid $gray700",
  height: "min-content",

  "@media(max-width: 1236px)": {
    width: "100%",
  },
});

export const UserProfile = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "1.25rem",

  alignItems: "center",

  img: {
    width: "4.5rem",
    height: "4.5rem",

    borderRadius: "999px",
  },

  span: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.25rem",

    h2: {
      fontSize: "1.25rem",
      color: "$gray100",
      lineHeight: "$short",
      fontWeight: "$bold",
    },

    span: {
      fontSize: "0.875rem",
      fontWeight: "$regular",
      lineHeight: "$base",
      color: "$gray400",
    },
  },
});

export const UserSeparator = styled("span", {
  width: "2rem",
  height: "0.25rem",

  borderRadius: "999px",

  backgroundImage: "$gradient-horizontal",
});

export const UserStatsContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "2.5rem",
  padding: "1.25rem 3.5rem",
});

export const UserStats = styled("div", {
  width: "100%",

  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "1.25rem",

  svg: {
    width: "2rem",
    height: "2rem",

    color: "$green100",
  },

  span: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "0.25rem",

    p: {
      fontWeight: "$bold",
      lineHeight: "$short",
      color: "$gray200",
    },

    span: {
      fontSize: "0.875rem",
      fontWeight: "$regular",
      lineHeight: "$base",
      color: "$gray300",
    },
  },

  variants: {
    category: {
      true: {
        p: {
          fontSize: "0.9rem",
        },
      },
    },
  },
});

export const ProfileBookFallback = styled("div", {
  display: "flex",
  flexDirection: "column",
  paddingTop: "5rem",
  alignItems: "center",
  gap: "1.5rem",

  width: "100%",
  height: "100%",

  p: {
    color: "$gray400",
    fontSize: "1rem",
    lineHeight: "$base",
  },

  svg: {
    color: "$gray500",
    width: "3rem",
    height: "3rem",

    "&:hover": {
      color: "$gray400",
    },
  },
});

export const ProfileCategoriesContainer = styled("div", {
  marginTop: '7.1rem',
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  padding: "1rem 1.5rem 1rem 0.75rem",
  border: "1px solid $gray600",
  borderRadius: "$lg",
  height: "max-content",
});

export const ProfileCategory = styled("button", {
  all: "unset",
  cursor: "pointer",

  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",

  fontSize: "1rem",
  fontWeight: "$regular",
  lineHeight: "$base",
  color: "$gray200",

  span: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "0.5rem",
    flexBasis: "100%",
    border: "1px solid transparent",
    borderRadius: "999px",
    padding: "0.25rem 1rem",

    transition: "all 0.2s ease-out",

    "&:hover": {
      color: "$gray200",
      backgroundColor: "$purple200",
      border: "1px solid $purple200",

      svg: {
        color: "$gray200",
        fill: "$gray200",
      },
    },
  },

  variants: {
    status: {
      FINISHED: {
        svg: {
          color: "$green400",
          fill: "$green400",
        },
      },

      READING: {
        svg: {
          color: "$yellow100",
          fill: "$yellow100",
        },
      },

      WANT_TO_READ: {
        svg: {
          color: "$blue100",
          fill: "$blue100",
        },
      },

      ABANDONED: {
        svg: {
          color: "$red200",
          fill: "$red200",
        },
      },

      USER_RATINGS: {
        svg: {
          color: "$purple100",
          fill: "$purple100",
        },
      },

      FAVORITES: {
        svg: {
          color: "$green100",
          fill: "$green100",
        },
      },

      ALL_USER_BOOKS: {
        svg: {
          color: "$gray200",
        },
      },
    },

    isActive: {
      true: {
        span: {
          color: "$gray200",
          backgroundColor: "$purple200",
          border: "1px solid $purple200",
          svg: {
            color: "$gray200",
            fill: "$gray200",
          },
        },
      },
    },
  },
});
