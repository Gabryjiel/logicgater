import type { BatteryChip as TBatteryChip, ChipId } from ".";
import {
  useAppSelector,
} from "../providers/redux";
import { BasicChip } from "./Basic";

export function BatteryChip(props: { chipId: ChipId }) {
  const data = useAppSelector(
    (state) => state.chips[props.chipId],
  ) as TBatteryChip;
  return (
    <BasicChip
      chipId={props.chipId}
      type="BATTERY"
      inputs={data.inputs}
      position={data.position}
      outputs={data.outputs}
      title={`${data.name} (${data.type}) \n${data.value} [MJ]`}
    />
  );
}
