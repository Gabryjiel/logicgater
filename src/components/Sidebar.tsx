import { type ChipType, chipFactory } from "../nodes";
import { Actions, useAppDispatch } from "../providers/redux";

export function Sidebar(props: { isOpen: boolean }) {
  const dispatch = useAppDispatch();

  const handleSidebarElementClick: React.MouseEventHandler<HTMLDivElement> = (
    event,
  ) => {
    event.preventDefault();

    const chipType = event.currentTarget.dataset.chipType;
    if (chipType) {
      dispatch(Actions.addChip(chipFactory.create(chipType)));
    }
  };

  return props.isOpen ? (
    <aside id="sidebar">
      <div className="sidebar-group">
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
      </div>
    </aside>
  ) : (
    <></>
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
