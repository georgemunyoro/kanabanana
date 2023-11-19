import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { type Board as BoardModel } from "@prisma/client";
import { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import Container from "./Container";
import { Item } from "./Item";
import { AddListButton } from "./AddListButton";
import { type BoardData } from "./types";
import { useBoard } from "./useBoard";
import { PointerSensorWithoutPreventDefault } from "./PointerSensorWithoutPreventDefault";
import { motion } from "framer-motion";

export interface BoardProps {
  board: Omit<BoardModel, "createdAt" | "updatedAt" | "data"> & {
    data: BoardData;
    createdAt: string;
    updatedAt: string;
  };
}

export const Board = ({ board }: BoardProps) => {
  const {
    lists,
    boardName,
    activeId,
    updateBoardName,
    addList,
    updateList,
    deleteList,
    addCardToList,
    updateCard,
    deleteCard,
    onDragStart,
    onDragMove,
    onDragEnd,
    getCardDescription,
    getCardTitle,
    getListDescription,
    getListTitle,
    getListItems,
  } = useBoard(board);

  const sensors = useSensors(
    useSensor(PointerSensorWithoutPreventDefault),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [isEditingBoardName, setIsEditingBoardName] = useState(false);

  return (
    <div className="flex grow flex-col gap-3">
      <Navbar isBordered className="h-14">
        <NavbarContent className="h-10">
          <NavbarBrand className="pr-5">
            {isEditingBoardName ? (
              <input
                autoFocus
                defaultValue={boardName}
                onBlur={(e) => {
                  updateBoardName(e.target.value);
                  setIsEditingBoardName(false);
                }}
                className="w-full bg-transparent text-large font-extralight outline-none"
              />
            ) : (
              <p
                className="w-full text-large font-extralight text-inherit"
                onClick={() => setIsEditingBoardName(true)}
              >
                {boardName}
              </p>
            )}
          </NavbarBrand>
          <NavbarItem></NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="flex w-full grow gap-3 overflow-x-auto overflow-y-hidden p-5">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={lists.map((list) => list.id)}>
            {lists.map((list) => (
              <Container
                key={list.id}
                id={list.id}
                title={list.title}
                description={list.description}
                onAddItem={addCardToList}
                onChangeTitle={(updatedTitle) =>
                  updateList(list.id, { title: updatedTitle })
                }
                onChangeDescription={(updatedDescription) =>
                  updateList(list.id, {
                    description: updatedDescription,
                    title: list.title,
                  })
                }
                onDelete={() => deleteList(list.id)}
              >
                <SortableContext items={list.items.map((item) => item.id)}>
                  {list.items.map((item) => (
                    <Item
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      description={item.description}
                      onUpdateCard={(updatedCard) =>
                        updateCard(list.id, updatedCard)
                      }
                      onDelete={() => deleteCard(list.id, item.id)}
                    />
                  ))}
                </SortableContext>
              </Container>
            ))}
          </SortableContext>

          <DragOverlay adjustScale={false} zIndex={100}>
            <motion.div animate={{rotate: 5, speed: 1000}}>
              {/* Drag Overlay For item Item */}
              {activeId && activeId.toString().includes("card") && (
                <Item
                  id={activeId}
                  title={getCardTitle(activeId)}
                  description={getCardDescription(activeId)}
                />
              )}
              {/* Drag Overlay For Container */}
              {activeId && activeId.toString().includes("list") && (
                <Container
                  id={activeId}
                  title={getListTitle(activeId)}
                  description={getListDescription(activeId)}
                >
                  {getListItems(activeId).map((i) => (
                    <Item
                      key={i.id}
                      id={i.id}
                      title={i.title}
                      description={i.description}
                    />
                  ))}
                </Container>
              )}
            </motion.div>
          </DragOverlay>
        </DndContext>
        <AddListButton onAddList={addList} />
      </div>
    </div>
  );
};
