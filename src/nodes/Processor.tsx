import { useCallback, useEffect, useRef, useState } from "react";
import { calculateChipPositionFromBrowser } from "../lib/chipUtils";
import { useBoolean } from "../lib/useBoolean";
import { DRAG_TYPES, PIXELS_PER_CHIP } from "../providers/constants";
import { useAppDispatch, useAppSelector } from "../providers/redux";
import { ChipSlice } from "../providers/redux/chips";
import { ConnectionSlice } from "../providers/redux/connections";
import { openSidebar, SidebarSlice } from "../providers/redux/sidebar";
import type {
  ChipConnection,
  ChipId,
  Position,
  ProcessorChip,
  ProcessorSubchip,
} from ".";
import { AndGate } from "./AndGate";
import { BasicChip } from "./Basic";
import { BatteryChip } from "./Battery";
import { Light } from "./Light";
import { Timer } from "./Timer";
import {
  blurMarker,
  holdWithMarker,
  moveMarkerDown,
  moveMarkerLeft,
  moveMarkerRight,
  moveMarkerTo,
  moveMarkerUp,
  releaseFromMarker,
} from "../providers/redux/marker";
import { Marker } from "../components/Marker";

export function Processor(props: { chipId: ChipId }) {
  const boardOpenBool = useBoolean();
  const chip = useAppSelector(
    (state) => state.chips[props.chipId] as ProcessorChip,
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
      {boardOpenBool.value && (
        <ProcessorBoard
          chipId={chip.id}
          chips={chip.chips}
          connections={chip.connections}
        />
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
  const sidebar = useAppSelector((state) => state.sidebar);
  const marker = useAppSelector((state) => state.marker);

  const [draggedChip, setDraggedChip] = useState<ChipId | null>(null);
  const [draggedChipPosition, setDraggedChipPosition] = useState<Position>({
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
      setDraggedChip(props.chips[0]?.chipId ?? null);
      setDraggedChipPosition(() => ({
        x: calculateChipPositionFromBrowser(event.pageX),
        y: calculateChipPositionFromBrowser(event.pageY),
      }));
    }
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();

    const chipId = event.dataTransfer.getData(DRAG_TYPES.CHIP);

    if (chipId === "") {
      return;
    }

    dispatch(
      ChipSlice.actions.moveChip({
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
    (event.target as HTMLDivElement).focus();
    const element = event.target as HTMLElement;

    if (
      element.classList.contains("processor-board") ||
      element.classList.contains("chip")
    ) {
      // if (sidebar?.type !== "CHIPS") {
      //   dispatch(SidebarSlice.actions.openSidebar({ type: "CHIPS" }));
      // }

      dispatch(
        moveMarkerTo({
          position: {
            x: calculateChipPositionFromBrowser(event.pageX),
            y: calculateChipPositionFromBrowser(event.pageY),
          },
          processorBoardId: props.chipId,
        }),
      );
    } else if (element.classList.contains("last-clicked-position")) {
      dispatch(blurMarker());
    }
  };

  const handleKeyUp: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (marker.status === "idle") {
      return;
    }

    if (event.key === "ArrowUp") {
      dispatch(moveMarkerUp());
    } else if (event.key === "ArrowDown") {
      dispatch(moveMarkerDown());
    } else if (event.key === "ArrowLeft") {
      dispatch(moveMarkerLeft());
    } else if (event.key === "ArrowRight") {
      dispatch(moveMarkerRight());
    } else if (event.key === "Enter") {
      if (marker.status === "placed") {
        const markedChip = props.chips.find(
          (chip) =>
            chip.position.x === marker.position.x &&
            chip.position.y === marker.position.y,
        );

        if (markedChip === undefined) {
          dispatch(openSidebar({ type: "CHIPS" }));
          dispatch(blurMarker());
        } else {
          dispatch(holdWithMarker(markedChip.chipId));
        }
      } else if (marker.status === "holding") {
        dispatch(releaseFromMarker());
      }
    }
  };

  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sidebar === null) {
      boardRef.current?.focus();
    }
  }, [sidebar])

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: it cant be a button
    <div
      className="processor-board"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      onKeyDown={handleKeyUp}
      ref={boardRef}
      tabIndex={-1}
    >
      {props.chipId === marker.processorBoardId && <Marker />}

      {props.chips.map((chip) => {
        switch (chip.type) {
          case "PROCESSOR":
            return <Processor key={chip.chipId} chipId={chip.chipId} />;
          case "BATTERY":
            return <BatteryChip key={chip.chipId} chipId={chip.chipId} />;
          case "AND_GATE":
            return <AndGate key={chip.chipId} chipId={chip.chipId} />;
          case "TIMER":
            return <Timer key={chip.chipId} chipId={chip.chipId} />;
          case "LIGHT":
            return <Light key={chip.chipId} chipId={chip.chipId} />;
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

      {draggedChip !== null && (
        <div
          className="chip-outline"
          style={{
            left: `${draggedChipPosition.x * PIXELS_PER_CHIP}px`,
            top: `${draggedChipPosition.y * PIXELS_PER_CHIP}px`,
          }}
        />
      )}
    </div>
  );
}

export function Connection(props: { connection: ChipConnection }) {
  const dispatch = useAppDispatch();
  const pos1 = useAppSelector(
    (state) => state.chips[props.connection.output.chipId],
  );
  const pos2 = useAppSelector(
    (state) => state.chips[props.connection.input.chipId],
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
    5,
  );

  const handleAuxClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.button === 1) {
      dispatch(ConnectionSlice.actions.removeConnection(props.connection));
    }
  };

  return (
    <div
      className="chip-connection"
      style={{
        height: `${5}px`,
        width: `${properties.distance}px`,
        left: `${properties.centerX}px`,
        top: `${properties.centerY}px`,
        transform: `rotate(${properties.angle}deg)`,
      }}
      title={`Connection beetween ${props.connection.output.outputId} and ${props.connection.input.inputId}`}
      onAuxClick={handleAuxClick}
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
