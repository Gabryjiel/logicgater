import type { AndGateChip, ChipId } from ".";
import { useAppSelector } from "../providers/redux";
import { BasicChip } from "./Basic";

export function AndGate(props: { chipId: ChipId }) {
  const data = useAppSelector(
    (state) => state.chips[props.chipId],
  ) as AndGateChip;

  return (
    <BasicChip
      chipId={props.chipId}
      inputs={data.inputs}
      position={data.position}
      type="AND_GATE"
      outputs={data.outputs}
      title={`${data.name} (And Gate)`}
    />
  );
}
