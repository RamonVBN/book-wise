import * as Tooltip from "@radix-ui/react-tooltip"
import { TooltipArrow, TooltipContent } from "./style"

type Props = {
  children: React.ReactNode
  content: string
}

export function AppTooltip({ children, content }: Props) {
  return (
    <Tooltip.Provider delayDuration={250}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <TooltipContent sideOffset={5} side="top">
            {content}
            <TooltipArrow />
          </TooltipContent>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}