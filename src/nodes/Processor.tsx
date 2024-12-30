import { useState } from "react";
import type { ChipId, ChipPosition, ProcessorChip, ProcessorSubchip } from ".";
import { useBoolean } from "../lib/useBoolean";
import { Actions, useAppDispatch, useAppSelector } from "../providers/redux";
import { DRAG_TYPES, PIXELS_PER_CHIP } from "../providers/constants";
import { calculateChipPositionFromBrowser } from "../lib/chipUtils";
import { BatteryChip } from "./Battery";
import { AndGateChip } from "./AndGate";
import { TimerChip } from "./Timer";
import { LightChip } from "./Light";
import { BasicChip } from "./Basic";

export function Processor(props: { chipId: ChipId }) {
  const boardOpenBool = useBoolean();
  const chip = useAppSelector(
    (state) => state.motherboard.chips[props.chipId] as ProcessorChip,
  );

  return (
    <>
      <BasicChip
        chipId={props.chipId}
        type="PROCESSOR"
        inputs={chip.inputs}
        outputs={chip.outputs}
        position={chip.position}
        title={`${chip.type}\n${chip.name}`}
      />
      {boardOpenBool.value ? (
        <ProcessorBoard chipId={chip.id} chips={chip.chips} />
      ) : (
        <></>
      )}
    </>
  );
}

export function ProcessorBoard(props: {
  chipId: ChipId;
  chips: ProcessorSubchip[];
}) {
  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector(
    (state) => state.motherboard.isSidebarOpen,
  );
  const lastClickedPosition = useAppSelector(
    (state) => state.motherboard.lastClickedPosition,
  );

  const [draggedChip, setDraggedChip] = useState<ChipId | null>(null);
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
      setDraggedChip(props.chips[0].chipId);
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
        chipId: chipId as ChipId,
        x: calculateChipPositionFromBrowser(event.pageX),
        y: calculateChipPositionFromBrowser(event.pageY),
      }),
    );
    setDraggedChip(null);
  };

  const handleDragLeave: React.DragEventHandler<HTMLDivElement> = () => {
    setDraggedChip(null);
  };

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();

    if (
      (event.target as HTMLDivElement)?.classList.contains("processor-board")
    ) {
      if (!isSidebarOpen) {
        dispatch(Actions.toggleSidebar());
      }

      dispatch(
        Actions.updateLastClickedPosition({
          x: calculateChipPositionFromBrowser(event.pageX),
          y: calculateChipPositionFromBrowser(event.pageY),
          processorId: props.chipId,
        }),
      );
    } else if (isSidebarOpen) {
      dispatch(Actions.toggleSidebar());
      dispatch(Actions.updateLastClickedPosition(null));
    }
  };

  return (
    <div
      className="processor-board"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      {isSidebarOpen && props.chipId === lastClickedPosition?.processorId ? (
        <div
          className="last-clicked-position"
          style={{
            top: PIXELS_PER_CHIP * lastClickedPosition.y,
            left: PIXELS_PER_CHIP * lastClickedPosition.x,
          }}
        />
      ) : null}
      {props.chips.map((chip) => {
        switch (chip.type) {
          case "PROCESSOR":
            return <Processor key={chip.chipId} chipId={chip.chipId} />;
          case "BATTERY":
            return <BatteryChip key={chip.chipId} chipId={chip.chipId} />;
          case "AND_GATE":
            return <AndGateChip key={chip.chipId} chipId={chip.chipId} />;
          case "TIMER":
            return <TimerChip key={chip.chipId} chipId={chip.chipId} />;
          case "LIGHT":
            return <LightChip key={chip.chipId} chipId={chip.chipId} />;
          default:
            return null;
        }
      })}

      {draggedChip ? (
        <div
          className="chip-outline"
          style={{
            left: `${draggedChipPosition.x * PIXELS_PER_CHIP}px`,
            top: `${draggedChipPosition.y * PIXELS_PER_CHIP}px`,
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
