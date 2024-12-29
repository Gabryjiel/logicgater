import { BasicChip } from "./Basic";

export function BatteryChip(props: { chipId: string; value: number }) {
  return (
    <BasicChip
      chipId={props.chipId}
      leftInputs={2}
      bottomInputs={0}
      position={{ x: 0, y: 0 }}
      label="Battery"
    />
  );
}
