import type { ChipId, LightChip } from ".";
import { useAppSelector } from "../providers/redux";
import { BasicChip } from "./Basic";

export function Light(props: { chipId: ChipId }) {
  const data = useAppSelector(
    (state) => state.chips[props.chipId],
  ) as LightChip;

  return (
    <BasicChip
      chipId={props.chipId}
      inputs={data.inputs}
      outputs={data.outputs}
      type="LIGHT"
      position={data.position}
      title={`${data.name} (LIGHT)\n${data.value} [LM]`}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "blue",
          filter: `brightness(${data.value / 100})`,
        }}
      />
    </BasicChip>
  );
}
