import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import type { DraggableAttributes } from "@dnd-kit/core";

import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

export type DragHandleProps = {
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
};

type SortableItemProps = {
  id: string;
  children: (dragHandle: {
    attributes: any;
    listeners: any;
  }) => React.ReactNode;
};

export function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    animateLayoutChanges: (args) => {
      const { isSorting, wasDragging } = args;

      if (isSorting || wasDragging) {
        return defaultAnimateLayoutChanges(args);
      }

      return true;
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),

    transition: transition ?? "transform 250ms ease",

    opacity: isDragging ? 0 : 1,

    willChange: "transform",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({
        attributes,
        listeners,
      })}
    </div>
  );
}
