import { type PointerEvent } from "react";
import { PointerSensor } from "@dnd-kit/core";

export class PointerSensorWithoutPreventDefault extends PointerSensor {
  static activators = [
    {
      eventName: "onPointerDown" as const,
      handler: ({ nativeEvent }: PointerEvent) => {
        const isEditDescription = nativeEvent.target.classList.contains("edit-description");

        if (nativeEvent.button !== 0 || isEditDescription) return false;
        return true;
      },
    },
  ];
}
