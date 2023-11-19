import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Button, cn } from "@nextui-org/react";
import { DotsVerticalRounded } from "@styled-icons/boxicons-regular";

interface DragHandleProps {
  listeners?: SyntheticListenerMap;
  className?: string;
}

export const DragHandle = ({ listeners, className }: DragHandleProps) => {
  return (
    <div className={cn("flex", className)} {...listeners}>
      <DotsVerticalRounded size={20} />
      <DotsVerticalRounded className="-ml-[15px]" size={20} {...listeners} />
    </div>
  );
};
