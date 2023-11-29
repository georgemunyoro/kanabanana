import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  cn,
  Card,
  CardBody,
  Divider,
  Input,
} from "@nextui-org/react";
import { AddToQueue } from "@styled-icons/boxicons-regular";
import { Inter } from "next/font/google";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const inter = Inter({ subsets: ["latin"] });

interface AddListButtonProps {
  onAddList: (listName: string) => void;
}

const addListSchema = z.object({
  name: z.string().min(1),
});

type AddListSchemaType = z.infer<typeof addListSchema>;

export const AddListButton = ({ onAddList }: AddListButtonProps) => {
  const [isAddingList, setIsAddingList] = useState(false);

  const { handleSubmit, register } = useForm<AddListSchemaType>({
    resolver: zodResolver(addListSchema),
  });

  return (
    <Popover
      offset={10}
      placement="bottom-start"
      isOpen={isAddingList}
      onOpenChange={(isOpen) => setIsAddingList(isOpen)}
    >
      <PopoverTrigger onClick={() => setIsAddingList(true)}>
        <Button
          className="mt-2 flex min-w-[300px] justify-start"
          variant="bordered"
          color="success"
          size="lg"
        >
          <AddToQueue size={20} />
          Add a list
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-auto p-0 dark", inter.className)}>
        <Card className="min-w-[300px]">
          <CardBody>
            <form
              onSubmit={handleSubmit((data) => {
                onAddList(data.name);
                setIsAddingList(false);
              })}
              className="flex flex-col gap-3"
            >
              <Input
                {...register("name")}
                placeholder="List name"
                variant="flat"
                size="sm"
                autoFocus
                label="List name"
                labelPlacement="outside"
                className="w-full"
                minLength={1}
                isRequired
              />
              <Divider />
              <Button
                color="secondary"
                variant="solid"
                className="w-full"
                size="sm"
              >
                Create
              </Button>
            </form>
          </CardBody>
        </Card>
      </PopoverContent>
    </Popover>
  );
};
