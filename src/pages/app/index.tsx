import { Navbar } from "@/components/Navbar";
import { db } from "@/server/db";
import { generateDarkGradient } from "@/utils/gradient";
import { getAuth } from "@clerk/nextjs/server";
import { Card, CardHeader } from "@nextui-org/react";
import { type Board } from "@prisma/client";
import { type GetServerSideProps } from "next";
import Link from "next/link";

interface DashboardProps {
  boards: (Omit<Board, "createdAt" | "updatedAt" | "data"> & {
    createdAt: string;
    updatedAt: string;
  })[];
}

export default function Dashboard({ boards }: DashboardProps) {
  return (
    <>
      <Navbar showCreateButton />
      <div className="grid w-9/12 grid-cols-4 grid-rows-4 gap-4 p-10">
        {boards?.map((board) => (
          <Link href={`/app/board/${board.id}`} key={board.id} className="h-32">
            <Card className="h-full w-full" isHoverable isPressable>
              <CardHeader className="absolute top-1 z-10 flex-col !items-start">
                <div className="flex gap-3">
                  <div
                    className="h-11 w-2 rounded-md"
                    style={{
                      background: generateDarkGradient(board.id.toString()),
                    }}
                  />
                  <div className="flex flex-col !items-start">
                    <p className="text-tiny font-bold uppercase text-white/60">
                      {new Date(board.createdAt).toDateString()}
                    </p>
                    <h4 className="text-left text-medium font-medium text-white">
                      {board.name}
                    </h4>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<DashboardProps> = async ({
  req,
}) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return {
      props: { boards: [] },
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    const boards = await db.board.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return {
      props: {
        boards: boards.map((board) => ({
          ...board,
          createdAt: board.createdAt.toUTCString(),
          updatedAt: board.updatedAt.toUTCString(),
        })),
      },
    };
  } catch (e) {
    return {
      props: { boards: [] },
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
