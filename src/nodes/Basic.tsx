import { useMemo } from "react";
import { DRAG_TYPES, PIXELS_PER_CHIP } from "../providers/constants";
import type {
  ChipId,
  ChipInputId,
  ChipOutputId,
  ChipPosition,
  ChipType,
} from "../nodes";
import { Actions, useAppDispatch } from "../providers/redux";

export function BasicChip(props: {
  chipId: ChipId;
  inputs: { inputId: ChipInputId; placement: "LEFT" | "BOTTOM" }[];
  outputs: { outputId: ChipOutputId; placement: "RIGHT" }[];
  position: ChipPosition;
  type: ChipType;
  title: string;
}): React.ReactNode {
  const handleDragStart: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.dataTransfer.setData(DRAG_TYPES.CHIP, props.chipId);
    event.dataTransfer.effectAllowed = "move";
  };

  const chipImage = useMemo(() => getChipImage(props.type), [props.type]);

  return (
    <div
      className="chip-container"
      style={{
        left: `${props.position.x * PIXELS_PER_CHIP}px`,
        top: `${props.position.y * PIXELS_PER_CHIP}px`,
      }}
      title={props.title}
    >
      <div className="chip" draggable="true" onDragStart={handleDragStart}>
        {chipImage}
      </div>
      <div className="chip-left-inputs">
        {props.inputs
          .filter((input) => input.placement === "LEFT")
          .map((input) => {
            return (
              <ChipInput
                key={`${props.chipId}:${input.inputId}`}
                chipId={props.chipId}
                inputId={input.inputId}
              />
            );
          })}
      </div>
      <div className="chip-bottom-inputs">
        {props.inputs
          .filter((input) => input.placement === "BOTTOM")
          .map((input) => {
            return (
              <ChipInput
                key={`${props.chipId}:${input.inputId}`}
                chipId={props.chipId}
                inputId={input.inputId}
              />
            );
          })}
      </div>
      <div className="chip-right-outputs">
        {props.outputs.map((output) => {
          return (
            <ChipOutput
              key={output.outputId}
              chipId={props.chipId}
              outputId={output.outputId}
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

export function ChipInput(props: {
  chipId: ChipId;
  inputId: ChipInputId;
}): React.ReactNode {
  const dispatch = useAppDispatch();

  const handleInputDragOver: React.DragEventHandler<HTMLDivElement> = (
    event,
  ) => {
    if (
      event.dataTransfer.types.includes(DRAG_TYPES.OUTPUT) &&
      event.dataTransfer.types.includes(DRAG_TYPES.OUTPUT_CHIP)
    ) {
      event.preventDefault();
    }
  };

  const handleInputDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
    const outputId = event.dataTransfer.getData(
      DRAG_TYPES.OUTPUT,
    ) as ChipOutputId;
    const outputChipId = event.dataTransfer.getData(
      DRAG_TYPES.OUTPUT_CHIP,
    ) as ChipId;
    const inputId = event.currentTarget.dataset.inputId as ChipInputId;
    const inputChipId = event.currentTarget.dataset.chipId as ChipId;

    if (outputId && inputId) {
      dispatch(
        Actions.addConnection({
          input: {
            chipId: inputChipId,
            inputId,
          },
          output: {
            chipId: outputChipId,
            outputId,
          },
        }),
      );
    }
  };

  return (
    <div
      id={props.inputId}
      data-chip-id={props.chipId}
      data-input-id={props.inputId}
      className="chip-input"
      onDragOver={handleInputDragOver}
      onDrop={handleInputDrop}
      title={props.inputId}
    />
  );
}

export function ChipOutput(props: {
  chipId: ChipId;
  outputId: ChipOutputId;
}): React.ReactNode {
  const handleOutputDragStart: React.DragEventHandler<HTMLDivElement> = (
    event,
  ) => {
    const outputId = event.currentTarget.dataset.outputId;

    if (outputId === undefined) {
      return;
    }

    event.dataTransfer.setData(DRAG_TYPES.OUTPUT, outputId);
    event.dataTransfer.setData(DRAG_TYPES.OUTPUT_CHIP, props.chipId);
    event.dataTransfer.effectAllowed = "link";
  };

  return (
    <div
      id={props.outputId}
      data-chip-id={props.chipId}
      data-output-id={props.outputId}
      className="chip-output"
      draggable="true"
      onDragStart={handleOutputDragStart}
      title={props.outputId}
    />
  );
}
