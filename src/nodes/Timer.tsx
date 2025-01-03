import type { ChipId, TimerChip } from ".";
import { useAppSelector } from "../providers/redux";
import { BasicChip } from "./Basic";

export function Timer(props: { chipId: ChipId }) {
  const data = useAppSelector(
    (state) => state.motherboard.chips[props.chipId],
  ) as TimerChip;

  return (
    <BasicChip
      chipId={props.chipId}
      inputs={data.inputs}
      outputs={data.outputs}
      position={data.position}
      type="TIMER"
      title={`${data.name} (TIMER)`}
    />
  );
}
