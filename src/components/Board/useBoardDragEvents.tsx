import { useState } from "react";
import {
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { type BoardList } from "./types";
import { produce } from "immer";

export const useBoardDragEvents = (
  lists: BoardList[],
  findValueOfItems: (
    id: UniqueIdentifier | undefined,
    type: "card" | "list",
  ) => BoardList | undefined,
  updateLists: (updatedLists: BoardList[]) => void,
) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const onDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const onDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;

    // Handle Items Sorting
    if (
      active.id.toString().includes("card") &&
      over?.id.toString().includes("card") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active container and over container
      const activeList = findValueOfItems(active.id, "card");
      const overList = findValueOfItems(over.id, "card");

      // If the active or over container is not found, return
      if (!activeList || !overList) return;

      // Find the index of the active and over container
      const activeListIndex = lists.findIndex(
        (list) => list.id === activeList.id,
      );
      const overListIndex = lists.findIndex((list) => list.id === overList.id);

      // Find the index of the active and over item
      const activeCardIndex = activeList.items.findIndex(
        (item) => item.id === active.id,
      );
      const overCardIndex = overList.items.findIndex(
        (item) => item.id === over.id,
      );
      // In the same container
      if (activeListIndex === overListIndex) {
        const updatedContainers = produce(lists, (draftState) => {
          draftState[activeListIndex]!.items = arrayMove(
            draftState[activeListIndex]!.items,
            activeCardIndex,
            overCardIndex,
          );
        });
        updateLists(updatedContainers);
      } else {
        // In different containers
        const updatedLists = produce(lists, (draftState) => {
          const [removedCard] = draftState[activeListIndex]!.items.splice(
            activeCardIndex,
            1,
          );
          draftState[overListIndex]!.items.splice(
            overCardIndex,
            0,
            removedCard!,
          );
        });
        updateLists(updatedLists);
      }
    }

    // Handling Item Drop Into a Container
    if (
      active.id.toString().includes("card") &&
      over?.id.toString().includes("list") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "card");
      const overContainer = findValueOfItems(over.id, "list");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = lists.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = lists.findIndex(
        (container) => container.id === overContainer.id,
      );

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      );

      // Remove the active item from the active container and add it to the over container
      const newItems = produce(lists, (draftState) => {
        const [removeditem] = draftState[activeContainerIndex]!.items.splice(
          activeitemIndex,
          1,
        );
        draftState[overContainerIndex]!.items.push(removeditem!);
      });
      updateLists(newItems);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Handling Container Sorting
    if (
      active.id.toString().includes("list") &&
      over?.id.toString().includes("list") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the index of the active and over container
      const activeContainerIndex = lists.findIndex(
        (container) => container.id === active.id,
      );
      const overContainerIndex = lists.findIndex(
        (container) => container.id === over.id,
      );
      // Swap the active and over container
      const newItems = produce(lists, (draftState) => {
        return arrayMove(draftState, activeContainerIndex, overContainerIndex);
      });
      updateLists(newItems);
    }

    // Handling item Sorting
    if (
      active.id.toString().includes("card") &&
      over?.id.toString().includes("card") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "card");
      const overContainer = findValueOfItems(over.id, "card");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = lists.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = lists.findIndex(
        (container) => container.id === overContainer.id,
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      );
      const overitemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id,
      );

      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        const newItems = produce(lists, (draftState) => {
          draftState[activeContainerIndex]!.items = arrayMove(
            draftState[activeContainerIndex]!.items,
            activeitemIndex,
            overitemIndex,
          );
        });
        updateLists(newItems);
      } else {
        // In different containers
        const newItems = produce(lists, (draftState) => {
          const [removeditem] = draftState[activeContainerIndex]!.items.splice(
            activeitemIndex,
            1,
          );
          draftState[overContainerIndex]!.items.splice(
            overitemIndex,
            0,
            removeditem!,
          );
        });
        updateLists(newItems);
      }
    }
    // Handling item dropping into Container
    if (
      active.id.toString().includes("card") &&
      over?.id.toString().includes("list") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "card");
      const overContainer = findValueOfItems(over.id, "list");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = lists.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = lists.findIndex(
        (container) => container.id === overContainer.id,
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      );

      const newItems = produce(lists, (draftState) => {
        const [removeditem] = draftState[activeContainerIndex]!.items.splice(
          activeitemIndex,
          1,
        );
        draftState[overContainerIndex]!.items.push(removeditem!);
      });
      updateLists(newItems);
    }
    setActiveId(null);
  };

  return {
    activeId,
    onDragStart,
    onDragMove,
    onDragEnd,
  };
};
