import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type UniqueIdentifier } from "@dnd-kit/core";
import { AddItemButton } from "./AddItemButton";
import {
  Divider,
  cn,
  ScrollShadow,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
  Textarea,
} from "@nextui-org/react";
import {
  DotsHorizontal,
  DotsVertical,
  DotsVerticalRounded,
  Menu,
  Trash,
} from "@styled-icons/boxicons-regular";
import { Inter } from "next/font/google";
import { Pencil } from "@styled-icons/boxicons-solid";
import { DragHandle } from "./DragHandle";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

interface ContainerProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
  title?: string;
  description?: string;
  onAddItem?: (itemName: string, containerId: UniqueIdentifier) => void;
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
      // {...listeners}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={cn(
        "xoutline-none flex flex-col rounded-lg outline-none",
        isDragging && "opacity-50",
      )}
    >
      <div className="flex w-full items-center justify-between rounded-t-lg border-[1px] border-foreground-50 bg-black">
        <div className="flex w-full items-center p-2">
          <ContainerTitle
            title={title}
            description={description}
            onChangeTitle={onChangeTitle}
            onChangeDescription={onChangeDescription}
            onDelete={onDelete}
            listeners={listeners}
          />
        </div>
      </div>
      <div className="flex max-h-[calc(100vh-350px)] min-h-[60px] overflow-y-auto border-x-[1px] border-foreground-50 bg-black">
        <div className="flex w-full flex-col gap-2 p-2">{children}</div>
      </div>
      <div className="w-full self-end rounded-b-lg border-[1px] border-foreground-50 bg-black p-2">
        <AddItemButton
          onAddItem={(itemName) => onAddItem && onAddItem(itemName, id)}
        />
      </div>
    </div>
  );
};

export default Container;

const inter = Inter({ subsets: ["latin"] });

interface ContainerTitleProps {
  title?: string;
  description?: string;
  onChangeTitle?: (title: string) => void;
  onChangeDescription?: (description: string) => void;
  onDelete?: () => void;
  listeners?: SyntheticListenerMap;
}

const ContainerTitle = ({
  listeners,
  title,
  description,
  onDelete,
  onChangeTitle,
  onChangeDescription,
}: ContainerTitleProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  return (
    <div className="flex w-full flex-col gap-y-1 p-3 pt-0">
      <div className={cn("flex h-full items-center justify-between gap-2")}>
        <DragHandle className="self-baseline pt-[6px]" listeners={listeners} />
        {isEditingTitle ? (
          <input
            className="bg-silver -mt-1 h-[32px] rounded-md py-3 pt-4 text-medium outline-none"
            defaultValue={title}
            autoFocus
            onBlur={(e) => {
              setIsEditingTitle(false);
            }}
            onKeyDown={(e) => {
              if ("value" in e.target) {
                const value = e.target.value as string;

                // Don't lose focus on spacebar
                if (e.key === " ") {
                  e.target.value = value + " ";
                  e.preventDefault();
                }

                // Save on enter
                if (e.key === "Enter") {
                  setIsEditingTitle(false);
                  if (value.length > 0 && value !== title)
                    onChangeTitle && onChangeTitle(value);
                }
              }
            }}
          />
        ) : (
          <Button
            className="w-full justify-start bg-transparent p-0 text-medium"
            size="sm"
            onClick={() => setIsEditingTitle(true)}
          >
            {title}
          </Button>
        )}
        <div className="h-full self-baseline">
          <Dropdown className={cn("dark", inter.className)}>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="flat">
                <DotsHorizontal size={20} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                key="update-description"
                className="text-foreground-600"
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditingDescription(true);
                  document.getElementById("edit-description")?.focus({
                    preventScroll: true,
                  });
                }}
              >
                <div className="flex items-center justify-start gap-1">
                  <Pencil size={20} />
                  Edit Description
                </div>
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                onClick={() => onDelete && onDelete()}
              >
                <div className="flex items-center justify-start gap-1">
                  <Trash size={20} />
                  Delete
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <Divider />

      {isEditingDescription ? (
        <Textarea
          id="edit-description"
          classNames={{
            input: "edit-description",
          }}
          className={cn("mt-2")}
          defaultValue={description}
          placeholder="Add a description..."
          rows={3}
          onLoad={(e) => {
            console.log("laoded");
          }}
          autoFocus
          onBlur={(e) => {
            if (
              e.relatedTarget?.role === "menuitem" ||
              e.relatedTarget?.role === "menu"
            ) {
              e.relatedTarget.blur();
              e.target.focus();
              e.target.click();
              console.log(e.target);
              return;
            }
            if (e.target.value !== description && e.target.value.length > 0)
              onChangeDescription && onChangeDescription(e.target.value);
            setIsEditingDescription(false);
          }}
          onKeyDown={(e) => {
            if ("value" in e.target) {
              const value = e.target.value as string;

              if (e.key === "Escape") setIsEditingDescription(false);

              // Don't lose focus on spacebar
              if (e.key === " ") {
                e.target.value = value + " ";
                e.preventDefault();
              }

              // Save on enter
              if (e.key === "Enter" && e.ctrlKey) {
                setIsEditingDescription(false);
                if (value !== description)
                  onChangeDescription && onChangeDescription(value);
              }
            }
          }}
        />
      ) : (
        <p className="pb-0 pt-2 text-sm text-foreground-500">{description}</p>
      )}
    </div>
  );
};
