export function BasicChip(props: {
  chipId: string;
  leftInputs: number;
  bottomInputs: number;
  label: string;
  position: { x: number; y: number };
}) {
  return <div id={props.chipId}>{props.label}</div>;
}
