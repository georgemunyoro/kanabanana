import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type UniqueIdentifier } from "@dnd-kit/core";
import { AddItemButton } from "./AddItemButton";
import { cn } from "@nextui-org/react";
import { type AddCardHandler } from "./types";
import { ContainerTitle } from "./ContainerTitle";

interface ContainerProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
  title?: string;
  description?: string;
  onAddItem?: AddCardHandler;
  onChangeTitle?: (title: string) => void;
  onChangeDescription?: (description: string) => void;
  onDelete?: () => void;
}

const Container = ({
  id,
  children,
  title,
  description,
  onAddItem,
  onChangeTitle,
  onChangeDescription,
  onDelete,
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
      className={cn(
        "flex max-h-[calc(100vh-177px)] flex-col rounded-lg outline-none",
        isDragging && "opacity-50",
      )}
    >
      <div className="flex w-full items-center justify-between rounded-t-lg border-[1px] border-foreground-50 bg-black">
        <div className="flex w-full items-center p-2">
          <ContainerTitle
            id={id}
            title={title}
            description={description}
            onChangeTitle={onChangeTitle}
            onChangeDescription={onChangeDescription}
            onDelete={onDelete}
            listeners={listeners}
          />
        </div>
      </div>
      <div className="flex min-h-[60px] overflow-y-auto overflow-x-hidden border-x-[1px] border-foreground-50 bg-black">
        <div className="flex w-full flex-col gap-2 p-2">{children}</div>
      </div>
      <div className="w-full self-end rounded-b-lg border-[1px] border-foreground-50 bg-black p-2">
        <AddItemButton
          onAddItem={(cardTitle) => onAddItem && onAddItem(id, cardTitle)}
        />
      </div>
    </div>
  );
};

export default Container;
