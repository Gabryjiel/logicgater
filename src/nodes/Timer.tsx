import { BasicChip } from "./Basic";

export function TimerChip(props: { chipId: string }) {
  return (
    <BasicChip
      chipId={props.chipId}
      leftInputs={2}
      bottomInputs={0}
      position={{ x: 0, y: 0 }}
      label="AND Gate"
    />
  );
}
