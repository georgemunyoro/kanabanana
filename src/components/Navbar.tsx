import { UserButton, useAuth } from "@clerk/nextjs";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Popover,
  PopoverTrigger,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { CreateBoardForm } from "./CreateBoardForm";

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
