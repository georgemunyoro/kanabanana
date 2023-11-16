export type BoardCard = {
  id: number;
  title: string;
  description: string;
};

export type BoardList = {
  id: number;
  title: string;
  cards: BoardCard[];
};

export type BoardData = {
  columns: BoardList[];
};
