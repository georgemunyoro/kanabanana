import {
  type CreateBoardInputSchemaType,
  createBoardInputSchema,
} from "@/common/schema/board";
import { api } from "@/utils/api";
import { UserButton, useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Input,
  PopoverContent,
  Popover,
  PopoverTrigger,
  Card,
  CardBody,
  cn,
  CardFooter,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

const inter = Inter({ subsets: ["latin"] });

interface NavbarProps {
  showCreateButton?: boolean;
}

export const Navbar = ({ showCreateButton }: NavbarProps) => {
  const [isCreateBoardMenuOpen, setIsCreateBoardMenuOpen] = useState(false);
  const router = useRouter();
  const isAuthenticated = useAuth().isSignedIn;

  return (
    <NextUINavbar isBordered className="h-16">
      <NavbarBrand
        className="max-w-min cursor-pointer pr-5"
        onClick={() => router.push("/app")}
      >
        <p className="font-bold text-inherit">Kanabanana</p>
      </NavbarBrand>
      <NavbarContent className="hidden gap-4 sm:flex" justify="start">
        {showCreateButton && (
          <Popover
            offset={10}
            placement="bottom-start"
            isOpen={isCreateBoardMenuOpen}
            onOpenChange={(open) => setIsCreateBoardMenuOpen(open)}
          >
            <PopoverTrigger onClick={() => setIsCreateBoardMenuOpen(true)}>
              <Button
                color="primary"
                variant="solid"
                className="capitalize"
                size="sm"
              >
                Create
              </Button>
            </PopoverTrigger>
            <CreateBoardForm onClose={() => setIsCreateBoardMenuOpen(false)} />
          </Popover>
        )}
      </NavbarContent>
      <NavbarContent justify="end">
        {isAuthenticated && (
          <NavbarItem>
            <UserButton />
          </NavbarItem>
        )}
      </NavbarContent>
    </NextUINavbar>
  );
};

interface CreateBoardFormProps {
  onClose: () => void;
}

const CreateBoardForm = ({ onClose }: CreateBoardFormProps) => {
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
