import { Navbar } from "@/components/Navbar";
import { api } from "@/utils/api";
import { Button, Card } from "@nextui-org/react";

export default function Home() {
  const { data: boards } = api.board.getAll.useQuery();

  return (
    <>
      <Navbar showCreateButton />
      <div className="flex px-24 py-5">
        <Card>
          {boards?.map((board) => (
            <div key={board.id}>
              <p>{board.name}</p>
              <Button>View</Button>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}
