import { styled } from "@/pages/globalStyles"
import * as Tooltip from "@radix-ui/react-tooltip"


export const TooltipContent = styled(Tooltip.Content, {
  backgroundColor: "$gray600",
  color: "$gray200",
  padding: "6px 10px",
  borderRadius: 6,
  fontSize: '0.75rem',
  lineHeight: 1,
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  zIndex: 9999,
})

export const TooltipArrow = styled(Tooltip.Arrow, {
  fill: "$gray600",
})
