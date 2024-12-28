import { useState } from "react";
import type { AnyChip, ChipPosition, ProcessorChip } from ".";
import { useBoolean } from "../lib/useBoolean";
import { Actions, useAppDispatch } from "../providers/redux";
import { DRAG_TYPES } from "../providers/constants";
import { calculateChipPositionFromBrowser } from "../lib/chipUtils";
import { ChipComponent } from "../components/ChipComponent";

export function Processor(props: { chip: ProcessorChip }) {
  const boardOpenBool = useBoolean();

  return (
    <div
      id={props.chip.id}
      onClick={boardOpenBool.toggle}
      onKeyUp={boardOpenBool.toggle}
    >
      <span>{props.chip.id}</span>
      {boardOpenBool.value ? <ProcessorBoard chip={props.chip} /> : <></>}
    </div>
  );
}

export function ProcessorBoard(props: { chip: ProcessorChip }) {
  const dispatch = useAppDispatch();

  const [draggedChip, setDraggedChip] = useState<AnyChip | null>(null);
  const [draggedChipPosition, setDraggedChipPosition] = useState<ChipPosition>({
    x: 0,
    y: 0,
  });

  const handleDragEnter: React.DragEventHandler<HTMLDivElement> = (event) => {
    if (event.dataTransfer.types.includes(DRAG_TYPES.CHIP)) {
      event.preventDefault();
    }
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (event) => {
    if (event.dataTransfer.types.includes(DRAG_TYPES.CHIP)) {
      event.preventDefault();
      setDraggedChip(props.chip.chips[0]);
      setDraggedChipPosition(() => ({
        x: calculateChipPositionFromBrowser(event.pageX),
        y: calculateChipPositionFromBrowser(event.pageY),
      }));
    }
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();

    const chipId = event.dataTransfer.getData(DRAG_TYPES.CHIP);

    dispatch(
      Actions.moveChip({
        id: chipId,
        x: calculateChipPositionFromBrowser(event.pageX),
        y: calculateChipPositionFromBrowser(event.pageY),
      }),
    );
    setDraggedChip(null);
  };

  const handleDragLeave: React.DragEventHandler<HTMLDivElement> = () => {
    setDraggedChip(null);
  };

  return (
    <div
      className="processor-board"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
    >
      {props.chip.chips.map((chip) => {
        return <ChipComponent key={chip.id} chip={chip} />;
      })}

      {draggedChip ? (
        <div
          className="chip-outline"
          style={{
            left: `${draggedChipPosition.x * 50}px`,
            top: `${draggedChipPosition.y * 50}px`,
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
