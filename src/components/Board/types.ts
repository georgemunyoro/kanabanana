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
};

export type BoardData = {
  containers: BoardList[];
};
