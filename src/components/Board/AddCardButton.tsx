import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  cn,
  Card as NUICard,
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

interface AddCardButtonProps {
  onAddItem: (itemName: string) => void;
}

const addCardSchema = z.object({
  name: z.string().min(1),
});

type AddCardSchemaType = z.infer<typeof addCardSchema>;

export const AddCardButton = ({ onAddItem }: AddCardButtonProps) => {
  const [isAddingItem, setIsAddingItem] = useState(false);

  const { handleSubmit, register } = useForm<AddCardSchemaType>({
    resolver: zodResolver(addCardSchema),
  });

  return (
    <Popover
      offset={10}
      placement="bottom-start"
      isOpen={isAddingItem}
      onOpenChange={(open) => setIsAddingItem(open)}
    >
      <PopoverTrigger onClick={() => setIsAddingItem(true)}>
        <Button className="flex w-80 justify-start" variant="light">
          <AddToQueue size={20} />
          Add a card
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-auto p-0 dark", inter.className)}>
        <NUICard className="w-[300px]">
          <CardBody>
            <form
              onSubmit={handleSubmit((data) => {
                onAddItem(data.name);
                setIsAddingItem(false);
              })}
              className="flex flex-col gap-3"
            >
              <Input
                {...register("name")}
                placeholder="Card title ✨"
                variant="flat"
                size="sm"
                autoFocus
                label="Card title"
                labelPlacement="outside"
                className="w-full"
                minLength={1}
                isRequired
                onKeyDown={(e) => {
                  if ("value" in e.target && e.key === " ") {
                    e.preventDefault();
                    e.target.value = (e.target.value as string) + " ";
                  }
                }}
              />
              <Divider />
              <Button
                color="secondary"
                variant="solid"
                className="w-full"
                size="sm"
                type="submit"
              >
                Create
              </Button>
            </form>
          </CardBody>
        </NUICard>
      </PopoverContent>
    </Popover>
  );
};
