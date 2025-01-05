import { type ChipType, chipFactory } from "../nodes";
import { Actions, useAppDispatch, useAppSelector } from "../providers/redux";
import { SidebarGroup, SidebarHeader } from "./Sidebars";

export function SidebarChips() {
  const dispatch = useAppDispatch();
  const lastClickedPosition = useAppSelector(
    (state) => state.motherboard.lastClickedPosition,
  );

  const handleSidebarElementClick: React.MouseEventHandler<HTMLDivElement> = (
    event,
  ) => {
    event.preventDefault();

    const chipType = event.currentTarget.dataset.chipType;
    if (chipType && lastClickedPosition) {
      dispatch(
        Actions.addChip(
          chipFactory.create(chipType, { position: lastClickedPosition }),
        ),
      );

      dispatch(Actions.updateLastClickedPosition(null));
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
        />
        <SidebarElement
          chipType="PROCESSOR"
          name="Processor"
          onClick={handleSidebarElementClick}
        />
        <SidebarElement
          chipType="AND_GATE"
          name="AND Gate"
          onClick={handleSidebarElementClick}
        />
        <SidebarElement
          chipType="LIGHT"
          name="Light"
          onClick={handleSidebarElementClick}
        />
        <SidebarElement
          chipType="TIMER"
          name="Timer"
          onClick={handleSidebarElementClick}
        />
      </SidebarGroup>
    </>
  );
}

export function SidebarElement(props: {
  chipType: ChipType;
  name: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div
      data-chip-type={props.chipType}
      className="sidebar-element"
      onClick={props.onClick}
      title={props.name}
    >
      {props.name}
    </div>
  );
}
