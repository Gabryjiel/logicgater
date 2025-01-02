import { useEffect, useRef, useState } from "react";
import type {
  ChipConnection,
  ChipId,
  ChipPosition,
  ProcessorChip,
  ProcessorSubchip,
} from ".";
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
        <ProcessorBoard
          chipId={chip.id}
          chips={chip.chips}
          connections={chip.connections}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export function ProcessorBoard(props: {
  chipId: ChipId;
  chips: ProcessorSubchip[];
  connections: ChipConnection[];
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
      onKeyDown={() => null}
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

      {props.connections.map((connection) => {
        return (
          <Connection
            key={connection.output.outputId + connection.input.inputId}
            connection={connection}
          />
        );
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

export function Connection(props: { connection: ChipConnection }) {
  const pos1 = useAppSelector(
    (state) => state.motherboard.chips[props.connection.output.chipId].position,
  );
  const pos2 = useAppSelector(
    (state) => state.motherboard.chips[props.connection.input.chipId].position,
  );
  const [_, setState] = useState(0);

  const outputRef = useRef(
    document.getElementById(props.connection.output.outputId),
  );
  const inputRef = useRef(
    document.getElementById(props.connection.input.inputId),
  );

  useEffect(() => {
    setState((prev) => prev + 1);
  }, [pos1, pos2]);

  if (outputRef.current === null || inputRef.current === null) {
    return null;
  }

  const properties = calculateConnectionCoordinates(
    outputRef.current,
    inputRef.current,
    3,
  );

  return (
    <div
      className="chip-connection"
      style={{
        height: `${3}px`,
        width: `${properties.distance}px`,
        left: `${properties.centerX}px`,
        top: `${properties.centerY}px`,
        transform: `rotate(${properties.angle}deg)`,
      }}
    />
  );
}

// Via https://stackoverflow.com/questions/8672369/how-to-draw-a-line-between-two-divs#answer-8673281

type Offset = {
  left: number;
  top: number;
  width: number;
  height: number;
};

function getOffset(element: HTMLElement): Offset {
  const rect = element.getBoundingClientRect();

  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
    width: rect.width || element.offsetWidth,
    height: rect.height || element.offsetHeight,
  };
}

function calculateConnectionCoordinates(
  outputElement: HTMLElement,
  inputElement: HTMLElement,
  thickness: number,
) {
  const outputOffset = getOffset(outputElement);
  const inputOffset = getOffset(inputElement);

  const x1 = outputOffset.left + outputOffset.width / 2;
  const y1 = outputOffset.top + outputOffset.height / 2;

  const x2 = inputOffset.left + inputOffset.width / 2;
  const y2 = inputOffset.top + inputOffset.height / 2;

  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const centerX = (x1 + x2) / 2 - distance / 2;
  const centerY = (y1 + y2) / 2 - thickness / 2;

  const angle = Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI);

  return {
    centerX,
    centerY,
    distance,
    angle,
  };
}
