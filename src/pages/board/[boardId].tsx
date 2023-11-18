import { db } from "@/server/db";
import { getAuth } from "@clerk/nextjs/server";
import { type Board as BoardModel } from "@prisma/client";
import { type GetServerSideProps } from "next";
import { Navbar } from "@/components/Navbar";
import { Board } from "@/components/Board";
import { type BoardData } from "@/components/Board/types";

interface BoardPageProps {
  board?: Omit<BoardModel, "createdAt" | "updatedAt" | "data"> & {
    data: BoardData;
    createdAt: string;
    updatedAt: string;
  };
}

export default function BoardPage({ board }: BoardPageProps) {
  if (!board) return null;

  return (
    <div className="flex h-full w-full flex-col">
      <Navbar />
      <Board board={board} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<BoardPageProps> = async ({
  params,
  req,
}) => {
  const user = getAuth(req);

  if (!params?.boardId || !user.userId || typeof params.boardId == "object") {
    return {
      notFound: true,
    };
  }

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      userId: user.userId,
    },
  });

  if (!board) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      board: {
        ...{
          ...board,
          data: JSON.parse(
            typeof board.data == "string" ? board.data : "{}",
          ) as BoardData,
        },
        createdAt: board?.createdAt?.toISOString() ?? "",
        updatedAt: board?.updatedAt?.toISOString() ?? "",
      },
    },
  };
};
