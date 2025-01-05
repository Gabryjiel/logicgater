import type { BatteryChip as TBatteryChip, ChipId } from ".";
import {
  SidebarActions,
  useAppDispatch,
  useAppSelector,
} from "../providers/redux";
import { BasicChip } from "./Basic";

export function BatteryChip(props: { chipId: ChipId }) {
  const data = useAppSelector(
    (state) => state.motherboard.chips[props.chipId],
  ) as TBatteryChip;
  const dispatch = useAppDispatch();

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    dispatch(SidebarActions.toggle("BATTERY_CHIP"));
  };

  return (
    <BasicChip
      chipId={props.chipId}
      type="BATTERY"
      inputs={data.inputs}
      position={data.position}
      onClick={handleClick}
      outputs={data.outputs}
      title={`${data.name} (${data.type}) \n${data.value} [MJ]`}
    />
  );
}
