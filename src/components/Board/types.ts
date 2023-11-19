import { type UniqueIdentifier } from "@dnd-kit/core";

export type BoardCard = {
  id: UniqueIdentifier;
  title: string;
  description?: string;
};

export type BoardList = {
  id: UniqueIdentifier;
  title: string;
  items: BoardCard[];
  description?: string;
};

export type BoardData = {
  containers: BoardList[];
};

export type AddCardHandler = (
  listId: UniqueIdentifier,
  cardTitle: string,
) => void;

export type UpdateCardHandler = (
  listId: UniqueIdentifier,
  updatedCard: BoardCard,
) => void;

export type DeleteCardHandler = (
  listId: UniqueIdentifier,
  cardId: UniqueIdentifier,
) => void;
