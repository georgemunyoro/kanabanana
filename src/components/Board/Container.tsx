import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type UniqueIdentifier } from "@dnd-kit/core";
import { AddItemButton } from "./AddItemButton";
import { Divider, cn, ScrollShadow } from "@nextui-org/react";

interface ContainerProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
  title?: string;
  description?: string;
  onAddItem?: (itemName: string, containerId: UniqueIdentifier) => void;
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
      {...listeners}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={cn("flex flex-col rounded-lg", isDragging && "opacity-50")}
    >
      <div className="flex w-full items-center justify-between rounded-t-lg border-[1px] border-foreground-50 bg-black">
        <div className="flex w-full flex-col gap-y-1 p-3">
          <h1 className="text-xl">{title}</h1>
          <Divider />
          <p className="text-sm text-foreground-500">
            Lorem ipsum dolor sit amet.
          </p>
        </div>
      </div>
      <div className="flex max-h-[calc(100vh-350px)] min-h-[60px] overflow-y-auto border-x-[1px] border-foreground-50 bg-black">
        <div className="flex w-full flex-col gap-2 p-2">{children}</div>
      </div>
      <div className="self-end rounded-b-lg border-[1px] border-foreground-50 bg-black p-2 w-full">
        <AddItemButton
          onAddItem={(itemName) => onAddItem && onAddItem(itemName, id)}
        />
      </div>
    </div>
  );
};

export default Container;
