import React, { useState } from "react";
import {
  Divider,
  cn,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Textarea,
} from "@nextui-org/react";
import { DotsHorizontal, Trash } from "@styled-icons/boxicons-regular";
import { Pencil } from "@styled-icons/boxicons-solid";
import { DragHandle } from "./DragHandle";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Inter } from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });

export interface ContainerTitleProps {
  title?: string;
  description?: string;
  onChangeTitle?: (title: string) => void;
  onChangeDescription?: (description: string) => void;
  onDelete?: () => void;
  listeners?: SyntheticListenerMap;
}

export const ContainerTitle = ({
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
          autoFocus
          onBlur={(e) => {
            if (
              e.relatedTarget?.role === "menuitem" ||
              e.relatedTarget?.role === "menu"
            ) {
              e.relatedTarget.blur();
              e.target.focus();
              e.target.click();
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
