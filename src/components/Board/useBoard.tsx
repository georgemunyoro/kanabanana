import { useState } from "react";
import { type UniqueIdentifier } from "@dnd-kit/core";
import { randomBytes } from "crypto";
import { api } from "@/utils/api";
import {
  type BoardCard,
  type BoardList,
  type AddCardHandler,
  type UpdateCardHandler,
  type DeleteCardHandler,
} from "./types";
import { produce } from "immer";
import { useBoardDragEvents } from "./useBoardDragEvents";
import { type BoardProps } from ".";

export const useBoard = (board: BoardProps["board"]) => {
  const [prevBoardName, setPrevBoardName] = useState(board.name);
  const [boardName, setBoardName] = useState(board.name);
  const [lists, setLists] = useState<BoardList[]>(board.data.containers);

  const revertBoardName = () => {
    setBoardName(prevBoardName);
  };

  const updateBoardNameApi = api.board.updateName.useMutation({
    onError: revertBoardName,
  });

  const updateBoardName = (newBoardName: string) => {
    if (newBoardName.length > 0 && newBoardName !== boardName) {
      setPrevBoardName(boardName);
      setBoardName(newBoardName);
      updateBoardNameApi.mutate({
        id: board.id,
        name: newBoardName,
      });
    }
  };

  const updateBoardData = api.board.update.useMutation();

  const updateLists = (updatedContainers: BoardList[]) => {
    setLists(updatedContainers);
    updateBoardData.mutate({
      id: board.id,
      data: {
        containers: updatedContainers,
      },
    });
  };

  const generateListId = () => `list-${randomBytes(16).toString("hex")}`;
  const generateCardId = () => `card-${randomBytes(16).toString("hex")}`;

  const addList = (listTitle: string) => {
    const updatedListState = produce(lists, (draftState) => {
      draftState.push({
        id: generateListId(),
        title: listTitle,
        items: [],
      });
    });
    updateLists(updatedListState);
  };

  const addCardToList: AddCardHandler = (listId, cardTitle) => {
    const updatedListState = produce(lists, (draftState) => {
      const listIndex = lists.findIndex((c) => c.id === listId);
      draftState[listIndex]?.items.push({
        id: generateCardId(),
        title: cardTitle,
        description: "",
      });
    });
    updateLists(updatedListState);
  };

  const updateCard: UpdateCardHandler = (listId, updatedCard) => {
    const updatedListState = produce(lists, (draftState) => {
      const listIndex = draftState.findIndex((l) => l.id === listId);
      if (listIndex === -1) return;
      const cardIndex = draftState[listIndex]!.items.findIndex(
        (c) => c.id === updatedCard.id,
      );
      if (cardIndex === -1) return;
      draftState[listIndex]!.items[cardIndex] = {
        ...updatedCard,
      };
    });
    updateLists(updatedListState);
  };

  const deleteCard: DeleteCardHandler = (listId, cardId) => {
    const updatedListState = produce(lists, (draftState) => {
      const listIndex = draftState.findIndex((l) => l.id === listId);
      if (listIndex === -1) return;
      draftState[listIndex]!.items = draftState[listIndex]!.items.filter(
        (c) => c.id !== cardId,
      );
    });
    updateLists(updatedListState);
  };

  const updateList = (
    listId: UniqueIdentifier,
    updatedList: Pick<BoardCard, "description" | "title">,
  ) => {
    const updatedListState = produce(lists, (draftState) => {
      const listIndex = draftState.findIndex((l) => l.id === listId);
      if (listIndex === -1) return;
      draftState[listIndex] = {
        ...draftState[listIndex]!,
        ...updatedList,
      };
    });
    updateLists(updatedListState);
  };

  const deleteList = (listId: UniqueIdentifier) => {
    const updatedListState = produce(lists, (draftState) => {
      return draftState.filter((l) => l.id !== listId);
    });
    updateLists(updatedListState);
  };

  const findValueOfItems = (
    id: UniqueIdentifier | undefined,
    type: "card" | "list",
  ) => {
    if (type === "list") {
      return lists.find((list) => list.id === id);
    }
    if (type === "card") {
      return lists.find((list) => list.items.find((card) => card.id === id));
    }
  };

  const getCardTitle = (id: UniqueIdentifier | undefined) => {
    const list = findValueOfItems(id, "card");
    if (!list) return "";
    const item = list.items.find((card) => card.id === id);
    if (!item) return "";
    return item.title;
  };

  const getCardDescription = (id: UniqueIdentifier | undefined) => {
    const list = findValueOfItems(id, "card");
    if (!list) return "";
    const card = list.items.find((card) => card.id === id);
    if (!card) return "";
    return card.description;
  };

  const getListTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "list");
    if (!container) return "";
    return container.title;
  };

  const getListDescription = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "list");
    if (!container) return "";
    return container.description;
  };

  const getListItems = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "list");
    if (!container) return [];
    return container.items;
  };

  const { activeId, onDragStart, onDragMove, onDragEnd } = useBoardDragEvents(
    lists,
    findValueOfItems,
    updateLists,
  );

  return {
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
    updateLists,
    revertBoardName,
    onDragStart,
    onDragMove,
    onDragEnd,
    getCardDescription,
    getCardTitle,
    getListDescription,
    getListTitle,
    getListItems,
  };
};
