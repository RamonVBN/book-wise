import {
  DndContext,
  closestCenter,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  defaultDropAnimation,
  type DragEndEvent,
  MeasuringStrategy,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { useState } from "react";

import { SortableItem } from "../SortableItem";

type BaseBook = {
  id: string;
};

type Props<T extends BaseBook> = {
  books: T[];

  renderBook: (book: T, dragHandle: any, dragging?: boolean) => React.ReactNode;

  onReorder: (reorderedBooks: T[]) => void;
};

export function SortableBooksList<T extends BaseBook>({
  books,
  renderBook,
  onReorder,
}: Props<T>) {
  const [activeOverlay, setActiveOverlay] = useState<React.ReactNode | null>(
    null,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 180,
        tolerance: 8,
      },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveOverlay(null);
      return;
    }

    const oldIndex = books.findIndex((book) => book.id === active.id);

    const newIndex = books.findIndex((book) => book.id === over.id);

    const reordered = arrayMove(books, oldIndex, newIndex);

    onReorder(reordered);

    setActiveOverlay(null);
  }

  return (
    <DndContext
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.WhileDragging,
        },
      }}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(event) => {
        const book = books.find((b) => b.id === event.active.id);

        if (!book) return;

        setActiveOverlay(renderBook(book, null, true));
      }}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveOverlay(null)}
    >
      <SortableContext
        items={books.map((book) => book.id)}
        strategy={verticalListSortingStrategy}
      >
        {books.map((book) => (
          <SortableItem key={book.id} id={book.id}>
            {(dragHandle) => renderBook(book, dragHandle, false)}
          </SortableItem>
        ))}
      </SortableContext>

      <DragOverlay adjustScale={false} dropAnimation={defaultDropAnimation}>
        {activeOverlay}
      </DragOverlay>
    </DndContext>
  );
}
