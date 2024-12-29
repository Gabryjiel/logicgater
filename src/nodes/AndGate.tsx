import type { ChipId } from ".";
import { useAppSelector } from "../providers/redux";
import { BasicChip } from "./Basic";

export function AndGateChip(props: { chipId: ChipId }) {
  const data = useAppSelector((state) => state.motherboard.chips[props.chipId]);

  return (
    <BasicChip
      chipId={props.chipId}
      inputs={data.inputs}
      position={data.position}
      type="AND_GATE"
      outputs={data.outputs}
    />
  );
}
