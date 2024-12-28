import { DRAG_TYPES } from "../providers/constants";
import { Actions, useAppDispatch } from "../providers/redux";

export function ChipInput(props: {
  chipId: string;
  inputIndex: number;
}): React.ReactNode {
  const inputId = `INPUT:${props.chipId}:${props.inputIndex}`;
  const dispatch = useAppDispatch();

  const handleInputDragEnter: React.DragEventHandler<HTMLDivElement> = (
    event,
  ) => {
    if (event.dataTransfer.types.includes(DRAG_TYPES.OUTPUT)) {
      event.preventDefault();
    }
  };

  const handleInputDragOver: React.DragEventHandler<HTMLDivElement> = (
    event,
  ) => {
    if (event.dataTransfer.types.includes(DRAG_TYPES.OUTPUT)) {
      event.preventDefault();
    }
  };

  const handleInputDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
    const outputId = event.dataTransfer.getData(DRAG_TYPES.OUTPUT);
    const inputId = event.currentTarget.dataset.inputId;

    if (outputId && inputId) {
      dispatch(
        Actions.addConnection({
          outputId,
          inputId,
        }),
      );
    }
  };

  return (
    <div
      data-chip-id={props.chipId}
      data-input-id={inputId}
      className="chip-input"
      onDragEnter={handleInputDragEnter}
      onDragOver={handleInputDragOver}
      onDrop={handleInputDrop}
    />
  );
}
