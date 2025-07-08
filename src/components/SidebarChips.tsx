import { type ChipType, chipFactory } from "../nodes";
import { useAppDispatch, useAppSelector } from "../providers/redux";
import { ChipSlice } from "../providers/redux/chips";
import { UtilsSlice } from "../providers/redux/utils";
import { SidebarGroup, SidebarHeader } from "./Sidebars";

export function SidebarChips() {
  const dispatch = useAppDispatch();
  const lastClickedPosition = useAppSelector(
    (state) => state.utils,
  );

  const handleSidebarElementClick: React.MouseEventHandler<HTMLDivElement> = (
    event,
  ) => {
    event.preventDefault();

    const chipType = event.currentTarget.dataset.chipType;
    if (chipType && lastClickedPosition) {
      dispatch(
        ChipSlice.actions.addChip(
          chipFactory.create(chipType, { position: lastClickedPosition }),
        ),
      );

      dispatch(UtilsSlice.actions.updateLastClickedPosition(null));
    }
  };

  const handleSidebarElementKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (
    event,
  ) => {
    event.preventDefault();

    const chipType = event.currentTarget.dataset.chipType;
    if (chipType && lastClickedPosition) {
      dispatch(
        ChipSlice.actions.addChip(
          chipFactory.create(chipType, { position: lastClickedPosition }),
        ),
      );

      dispatch(UtilsSlice.actions.updateLastClickedPosition(null));
    }
  };
  return (
    <>
      <SidebarHeader title="Chips" />
      <SidebarGroup>
        <SidebarElement
          chipType="BATTERY"
          name="Battery"
          onClick={handleSidebarElementClick}
          onKeyDown={handleSidebarElementKeyDown}
        />
        <SidebarElement
          chipType="PROCESSOR"
          name="Processor"
          onClick={handleSidebarElementClick}
          onKeyDown={handleSidebarElementKeyDown}
        />
        <SidebarElement
          chipType="AND_GATE"
          name="AND Gate"
          onClick={handleSidebarElementClick}
          onKeyDown={handleSidebarElementKeyDown}
        />
        <SidebarElement
          chipType="LIGHT"
          name="Light"
          onClick={handleSidebarElementClick}
          onKeyDown={handleSidebarElementKeyDown}
        />
        <SidebarElement
          chipType="TIMER"
          name="Timer"
          onClick={handleSidebarElementClick}
          onKeyDown={handleSidebarElementKeyDown}
        />
      </SidebarGroup>
    </>
  );
}

export function SidebarElement(props: {
  chipType: ChipType;
  name: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
}) {
  return (
    <div
      data-chip-type={props.chipType}
      className="sidebar-element"
      onClick={props.onClick}
      onKeyDown={props.onKeyDown}
      title={props.name}
    >
      {props.name}
    </div>
  );
}
