import {
  type CreateBoardInputSchemaType,
  createBoardInputSchema,
} from "@/common/schema/board";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  PopoverContent,
  Card,
  CardBody,
  cn,
  CardFooter,
  Divider,
} from "@nextui-org/react";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useForm } from "react-hook-form";

const inter = Inter({ subsets: ["latin"] });

interface CreateBoardFormProps {
  onClose: () => void;
}

export const CreateBoardForm = ({ onClose }: CreateBoardFormProps) => {
  const ref = useRef<HTMLFormElement>(null);

  const { register, handleSubmit, formState } =
    useForm<CreateBoardInputSchemaType>({
      resolver: zodResolver(createBoardInputSchema),
    });

  const router = useRouter();

  const createBoard = api.board.create.useMutation({
    onSuccess: (data) => void router.push(`/app/board/${data.id}`),
    onError: (error) => {
      console.error(error);
      onClose();
    },
  });

  return (
    <PopoverContent className={cn("w-auto p-0 dark", inter.className)}>
      <Card className="w-[300px]">
        <CardBody>
          <form
            ref={ref}
            onSubmit={handleSubmit((data) => createBoard.mutate(data))}
          >
            <Input
              {...register("name")}
              placeholder="Board name"
              variant="flat"
              size="sm"
              autoFocus
              label="Board name"
              labelPlacement="outside"
              className="w-full"
              minLength={1}
              isRequired
              isInvalid={!!formState.errors.name}
              errorMessage={formState.errors.name?.message}
              isDisabled={createBoard.isLoading}
            />
          </form>
        </CardBody>
        <Divider />
        <CardFooter>
          <Button
            color="secondary"
            variant="solid"
            className="w-full"
            size="sm"
            onClick={() => ref.current?.requestSubmit()}
            isLoading={createBoard.isLoading}
          >
            Create
          </Button>
        </CardFooter>
      </Card>
    </PopoverContent>
  );
};
