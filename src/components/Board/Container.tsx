import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { type UniqueIdentifier } from "@dnd-kit/core";
import { AddItemButton } from "./AddItemButton";

interface ContainerProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
  title?: string;
  description?: string;
  onAddItem: (itemName: string, containerId: UniqueIdentifier) => void;
}

const Container = ({
  id,
  children,
  title,
  description,
  onAddItem,
}: ContainerProps) => {
  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "container",
    },
  });
  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        "flex h-full w-full flex-col gap-y-4 rounded-xl bg-gray-50 p-4",
        isDragging && "opacity-50",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-xl text-gray-800">{title}</h1>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        <button
          className="rounded-xl border p-2 text-xs shadow-lg hover:shadow-xl"
          {...listeners}
        >
          Drag Handle
        </button>
      </div>
      {children}
      <AddItemButton onAddItem={(itemName) => onAddItem(itemName, id)} />
    </div>
  );
};

export default Container;
