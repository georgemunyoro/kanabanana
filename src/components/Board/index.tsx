import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
} from "@nextui-org/react";
import { type Board as BoardModel } from "@prisma/client";
import { AddToQueue } from "@styled-icons/boxicons-regular";
import { Inter } from "next/font/google";
import { useCallback, useRef, useState } from "react";
import { type BoardData } from "./types";
import {
  DndContext,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  type UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import Container from "./Container";
import { arrayMove } from "@dnd-kit/sortable";
import { Item } from "./Item";
import { randomBytes } from "crypto";
import { AddListButton } from "./AddListButton";

const inter = Inter({ subsets: ["latin"] });

interface BoardProps {
  board: Omit<BoardModel, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
  };
}

const dummyBoardData: BoardData = {
  columns: [
    {
      id: 1,
      title: "Backlog",
      cards: [
        {
          id: 1,
          title: "Add card",
          description: "Add capability to add a card in a column",
        },
      ],
    },
    {
      id: 2,
      title: "Doing",
      cards: [
        {
          id: 2,
          title: "Drag-n-drop support",
          description: "Move a card between the columns",
        },
      ],
    },
    {
      id: 3,
      title: "Done",
      cards: [
        {
          id: 3,
          title: "Other stuff",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        },
        {
          id: 4,
          title: "Some other stuff",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        },
        {
          id: 5,
          title: "Some other stuff",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        },
      ],
    },
    {
      id: 4,
      title: "Other",
      cards: [
        {
          id: 6,
          title: "Some other stuff",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        },
        {
          id: 7,
          title: "Some other stuff",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        },
      ],
    },
    {
      id: 5,
      title: "Other",
      cards: [
        {
          id: 8,
          title: "Some other stuff",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        },
      ],
    },
  ],
};

type DNDType = {
  id: UniqueIdentifier;
  title: string;
  items: {
    id: UniqueIdentifier;
    title: string;
  }[];
};

export const Board = ({ board }: BoardProps) => {
  const [boardData, setBoardData] = useState<BoardData | null>(dummyBoardData);

  const [containers, setContainers] = useState<DNDType[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [currentContainerId, setCurrentContainerId] =
    useState<UniqueIdentifier>();

  const onAddContainer = (containerName: string) => {
    const id = `container-${randomBytes(16).toString("hex")}`;
    setContainers([
      ...containers,
      {
        id,
        title: containerName,
        items: [],
      },
    ]);
  };

  const onAddItem = (itemName: string, containerId: UniqueIdentifier) => {
    const id = `item-${randomBytes(16).toString("hex")}`;
    const container = containers.find((item) => item.id === containerId);
    if (!container) return;
    container.items.push({
      id,
      title: itemName,
    });
    setContainers([...containers]);
  };

  // Find the value of the items
  function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
    if (type === "container") {
      return containers.find((item) => item.id === id);
    }
    if (type === "item") {
      return containers.find((container) =>
        container.items.find((item) => item.id === id),
      );
    }
  }

  const findItemTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "item");
    if (!container) return "";
    const item = container.items.find((item) => item.id === id);
    if (!item) return "";
    return item.title;
  };

  const findContainerTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "container");
    if (!container) return "";
    return container.title;
  };

  const findContainerItems = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "container");
    if (!container) return [];
    return container.items;
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const onDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;

    // Handle Items Sorting
    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("item") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active container and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      );

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      );
      const overitemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id,
      );
      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        const newItems = [...containers];
        newItems[activeContainerIndex]!.items = arrayMove(
          newItems[activeContainerIndex]!.items,
          activeitemIndex,
          overitemIndex,
        );

        setContainers(newItems);
      } else {
        // In different containers
        const newItems = [...containers];
        const [removeditem] = newItems[activeContainerIndex]!.items.splice(
          activeitemIndex,
          1,
        );
        newItems[overContainerIndex]!.items.splice(
          overitemIndex,
          0,
          removeditem as DNDType,
        );
        setContainers(newItems);
      }
    }

    // Handling Item Drop Into a Container
    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "container");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      );

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      );

      // Remove the active item from the active container and add it to the over container
      const newItems = [...containers];
      const [removeditem] = newItems[activeContainerIndex]!.items.splice(
        activeitemIndex,
        1,
      );
      newItems[overContainerIndex]!.items.push(removeditem as DNDType);
      setContainers(newItems);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Handling Container Sorting
    if (
      active.id.toString().includes("container") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === active.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === over.id,
      );
      // Swap the active and over container
      let newItems = [...containers];
      newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex);
      setContainers(newItems);
    }

    // Handling item Sorting
    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("item") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      );
      const overitemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id,
      );

      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        const newItems = [...containers];
        newItems[activeContainerIndex]!.items = arrayMove(
          newItems[activeContainerIndex]!.items,
          activeitemIndex,
          overitemIndex,
        );
        setContainers(newItems);
      } else {
        // In different containers
        const newItems = [...containers];
        const [removeditem] = newItems[activeContainerIndex]!.items.splice(
          activeitemIndex,
          1,
        );
        newItems[overContainerIndex]!.items.splice(
          overitemIndex,
          0,
          removeditem as DNDType,
        );
        setContainers(newItems);
      }
    }
    // Handling item dropping into Container
    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "container");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      );

      const newItems = [...containers];
      const [removeditem] = newItems[activeContainerIndex]!.items.splice(
        activeitemIndex,
        1,
      );
      newItems[overContainerIndex]!.items.push(removeditem as DNDType);
      setContainers(newItems);
    }
    setActiveId(null);
  };

  return (
    <div className="flex grow flex-col gap-3">
      <Navbar isBordered className="h-14">
        <NavbarContent className="h-10">
          <NavbarBrand className="max-w-min pr-5">
            <p className="text-large font-extralight text-inherit">
              {board.name}
            </p>
          </NavbarBrand>
          <NavbarItem></NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="flex w-full grow gap-3 overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={containers.map((container) => container.id)}>
            {containers.map((container) => (
              <Container
                key={container.id}
                id={container.id}
                description=""
                title={container.title}
                onAddItem={onAddItem}
              >
                <SortableContext items={container.items.map((item) => item.id)}>
                  {container.items.map((item) => (
                    <Item key={item.id} id={item.id} title={item.title} />
                  ))}
                </SortableContext>
              </Container>
            ))}
          </SortableContext>
        </DndContext>
        <AddListButton onAddList={onAddContainer} />
      </div>
    </div>
  );
};
