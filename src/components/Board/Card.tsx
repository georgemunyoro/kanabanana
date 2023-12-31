import { type UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import React, { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import {
  Button,
  Card as NUICard,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  cn,
} from "@nextui-org/react";
import { DragHandle } from "./DragHandle";
import { Inter } from "next/font/google";
import { Trash } from "@styled-icons/boxicons-regular";
import { type BoardCard } from "./types";

type CardProps = {
  id: UniqueIdentifier;
  title: string;
  description?: string;
  onUpdate?: (updatedCard: BoardCard) => void;
  onDelete?: () => void;
};

const inter = Inter({ subsets: ["latin"] });

export const Card = ({
  id,
  title,
  description,
  onUpdate: onUpdateCard,
  onDelete,
}: CardProps) => {
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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedDescription, setUpdatedDescription] = useState(description);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={cn("w-80", isDragging && "opacity-50")}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditModalOpen(true);
      }}
    >
      <NUICard isHoverable radius="sm">
        <CardHeader className="flex items-center p-1 py-3">
          <DragHandle className="self-baseline pt-1" listeners={listeners} />
          <div className="pl-2 pr-1">{title}</div>
        </CardHeader>
        <Divider />
        <CardBody className="text-sm text-foreground-500">
          <pre className="whitespace-pre-line font-sans">{description}</pre>
        </CardBody>
      </NUICard>

      <Modal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        className={cn("text-foreground dark", inter.className)}
        onClose={() => {
          onUpdateCard &&
            onUpdateCard({
              id,
              description: updatedDescription,
              title: updatedTitle,
            });
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody className="pb-10">
                <Input
                  label="Card Title"
                  variant="underlined"
                  defaultValue={title}
                  size="lg"
                  onValueChange={(value) => setUpdatedTitle(value)}
                />
                <Textarea
                  label="Description"
                  placeholder="Add a description..."
                  variant="faded"
                  defaultValue={description}
                  size="lg"
                  minRows={5}
                  onValueChange={(value) => setUpdatedDescription(value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  className="text-danger"
                  variant="flat"
                  onClick={onDelete}
                >
                  <div className="flex items-center justify-start gap-1">
                    <Trash size={20} />
                    Delete card
                  </div>
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
