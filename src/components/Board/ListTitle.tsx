import React from "react";
import {
  Divider,
  cn,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { DotsHorizontal, Trash } from "@styled-icons/boxicons-regular";
import { DragHandle } from "./DragHandle";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Inter } from "next/font/google";
import { type UniqueIdentifier } from "@dnd-kit/core";

export const inter = Inter({ subsets: ["latin"] });

export interface ListTitleProps {
  id: UniqueIdentifier;
  title?: string;
  description?: string;
  onChangeTitle?: (title: string) => void;
  onChangeDescription?: (description: string) => void;
  onDelete?: () => void;
  listeners?: SyntheticListenerMap;
}

export const ListTitle = ({
  id,
  listeners,
  title,
  description,
  onDelete,
  onChangeTitle,
  onChangeDescription,
}: ListTitleProps) => {
  return (
    <div className="flex w-full flex-col gap-y-1 p-3 pt-0">
      <div className={cn("flex h-full items-center justify-between gap-2")}>
        <DragHandle className="self-baseline" listeners={listeners} />
        <p
          className="w-52 self-start bg-transparent p-0 py-1 text-medium outline-none"
          contentEditable
          onBlur={(e) =>
            onChangeTitle &&
            e.target.innerText !== title &&
            onChangeTitle(e.target.innerText)
          }
        >
          {title}
        </p>
        <div className="h-full self-baseline">
          <Dropdown className={cn("dark", inter.className)}>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="flat">
                <DotsHorizontal size={20} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
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
      <p
        id={`description-${id}`}
        className="list-description-input w-72 pb-0 pt-2 text-sm text-foreground-500 outline-none duration-100"
        contentEditable
        onBlur={(e) => {
          if (onChangeDescription && e.target.innerText !== description)
            onChangeDescription(e.target.innerText);
        }}
      >
        {description}
      </p>
    </div>
  );
};
