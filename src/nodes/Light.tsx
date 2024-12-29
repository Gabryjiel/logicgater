import type { ChipId } from ".";
import { useAppSelector } from "../providers/redux";
import { BasicChip } from "./Basic";

export function LightChip(props: { chipId: ChipId }) {
  const data = useAppSelector((state) => state.motherboard.chips[props.chipId]);

  return (
    <BasicChip
      chipId={props.chipId}
      inputs={data.inputs}
      outputs={data.outputs}
      type="LIGHT"
      position={data.position}
    />
  );
}
