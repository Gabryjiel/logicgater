import { DRAG_TYPES } from "../providers/constants";

export function ChipOutput(props: {
  chipId: string;
  outputIndex: number;
}): React.ReactNode {
  const outputId = `OUTPUT:${props.chipId}:${props.outputIndex}`;

  const handleOutputDragStart: React.DragEventHandler<HTMLDivElement> = (
    event,
  ) => {
    const outputId = event.currentTarget.dataset.outputId;

    if (outputId === undefined) {
      return;
    }

    event.dataTransfer.setData(DRAG_TYPES.OUTPUT, outputId);
    event.dataTransfer.effectAllowed = "link";
  };

  return (
    <div
      key={outputId}
      data-chip-id={props.chipId}
      data-output-id={outputId}
      className="chip-output"
      draggable="true"
      onDragStart={handleOutputDragStart}
    />
  );
}
