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
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const inter = Inter({ subsets: ["latin"] });

interface AddItemButtonProps {
  onAddItem: (itemName: string) => void;
}

const addItemSchema = z.object({
  name: z.string().min(1),
});

type AddItemSchemaType = z.infer<typeof addItemSchema>;

export const AddItemButton = ({ onAddItem }: AddItemButtonProps) => {
  const [isAddingItem, setIsAddingItem] = useState(false);

  const ref = useRef<HTMLFormElement>(null);

  const { handleSubmit, register } = useForm<AddItemSchemaType>({
    resolver: zodResolver(addItemSchema),
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
        <Card className="w-[300px]">
          <CardBody>
            <form
              ref={ref}
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
        </Card>
      </PopoverContent>
    </Popover>
  );
};
