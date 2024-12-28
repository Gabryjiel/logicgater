import { useMemo } from "react";
import { DRAG_TYPES } from "../providers/constants";
import type { AnyChip, ChipType } from "../nodes";
import { ChipInput } from "./ChipInput";
import { ChipOutput } from "./ChipOutput";

export function ChipComponent(props: { chip: AnyChip }): React.ReactNode {
  const handleDragStart: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.dataTransfer.setData(DRAG_TYPES.CHIP, props.chip.id);
    event.dataTransfer.effectAllowed = "move";
  };

  const chipImage = useMemo(
    () => getChipImage(props.chip.type),
    [props.chip.type],
  );

  return (
    <div
      className="chip-container"
      style={{
        left: `${props.chip.position.x * 50}px`,
        top: `${props.chip.position.y * 50}px`,
      }}
    >
      <div className="chip" draggable="true" onDragStart={handleDragStart}>
        {chipImage}
      </div>
      <div className="chip-left-inputs">
        {Array.from({ length: props.chip.inputs }).map((_, idx) => {
          return (
            <ChipInput
              key={`INPUT:${props.chip.id}:${idx}`}
              chipId={props.chip.id}
              inputIndex={idx}
            />
          );
        })}
      </div>
      <div className="chip-bottom-inputs" />
      <div className="chip-right-outputs">
        {Array.from({ length: props.chip.outputs }).map((_, idx) => {
          const outputId = `OUTPUT:${props.chip.id}:${idx}`;

          return (
            <ChipOutput
              key={outputId}
              chipId={props.chip.id}
              outputIndex={idx}
            />
          );
        })}
      </div>
    </div>
  );
}

function getChipImage(chipType: ChipType) {
  switch (chipType) {
    case "PROCESSOR":
      return "Proc";
    case "BATTERY":
      return "Bat";
    case "AND_GATE":
      return "AND";
    case "TIMER":
      return "0:0";
    case "LIGHT":
      return "L";
    default:
      return "-";
  }
}
