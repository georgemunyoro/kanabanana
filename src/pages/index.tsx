import { Navbar } from "@/components/Navbar";
import { api } from "@/utils/api";
import { generateDarkGradient } from "@/utils/gradient";
import { Card, CardHeader } from "@nextui-org/react";
import { useRouter } from "next/router";

export default function Home() {
  const { data: boards } = api.board.getAll.useQuery();

  const router = useRouter();

  return (
    <>
      <Navbar showCreateButton />
      <div className="grid w-9/12 grid-cols-4 grid-rows-4 gap-4 p-10">
        {boards?.map((board) => (
          <Card
            key={board.id}
            className="h-[120px]"
            isHoverable
            isPressable
            onClick={(e) => void router.push(`/board/${board.id}`)}
          >
            <CardHeader className="absolute top-1 z-10 flex-col !items-start">
              <div className="flex gap-3">
                <div
                  className="h-11 w-2 rounded-md bg-red-500"
                  style={{
                    background: generateDarkGradient(board.id.toString()),
                  }}
                />
                <div className="flex flex-col !items-start">
                  <p className="text-tiny font-bold uppercase text-white/60">
                    {board.createdAt.toLocaleDateString()}
                  </p>
                  <h4 className="text-medium text-left font-medium text-white">
                    {board.name}
                  </h4>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
}
