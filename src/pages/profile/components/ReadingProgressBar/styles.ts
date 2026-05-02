import { styled } from "@/pages/globalStyles";
import * as Progress from "@radix-ui/react-progress";


export const ProgressRoot = styled(Progress.Root, {
  position: "relative",
  overflow: "hidden",
  backgroundColor: "$gray300",
  borderRadius: "9999px",
  width: "100%",
  height: "1.25rem",
});

export const ProgressIndicator = styled(Progress.Indicator, {
  width: "100%",
  height: "1.25rem",
  backgroundColor: "$green400",
  borderRadius: "9999px",
  transition: "transform 300ms ease",

  variants: {
    abandoned: {
      true: {
        backgroundColor: '$red200',
      }
    }
  }
});

export const Label = styled("label", {
  fontSize: "0.75rem",
  color: "$gray200",
});


export const ReadingProgressBarContainer = styled("div", {
  paddingTop: '1.75rem',
  display: "flex",
  flexDirection: "column",
  gap: '0.75rem',

  div: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',

    "@media(max-width: 320px)": {
      flexDirection: 'column',
      gap: '0.25rem',
    }
  },

  span: {
    color: '$gray200',
    fontSize: "0.75rem",
  }
});