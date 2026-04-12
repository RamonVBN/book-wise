import * as Tooltip from "@radix-ui/react-tooltip";
import { TooltipArrow, TooltipContent } from "./style";

type Props = {
  children: React.ReactNode;
  content: string;
  dragging?: boolean;
};

export function AppTooltip({ children, content, dragging = false }: Props) {
  return (
    <Tooltip.Provider delayDuration={500}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>

        <Tooltip.Portal>
          {!dragging && (
            <TooltipContent sideOffset={5} side="top">
              {content}
              <TooltipArrow />
            </TooltipContent>
          )}
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
