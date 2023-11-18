import { type UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

type ItemProps = {
  id: UniqueIdentifier;
  title: string;
};

export const Item = ({ id, title }: ItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "item",
    },
  });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx("w-80", isDragging && "opacity-50")}
    >
      <Card className="" isHoverable radius="sm">
        <CardHeader className="p-2 px-3">{title}</CardHeader>
        <Divider />
        <CardBody className="text-sm text-foreground-500">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </CardBody>
      </Card>
    </div>
  );
};
