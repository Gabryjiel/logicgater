import { useAppSelector } from "../providers/redux";
import { SidebarBattery } from "./SidebarBattery";
import { SidebarChips } from "./SidebarChips";

export function Sidebars() {
  const sidebarType = useAppSelector((state) => state.sidebar.value);

  if (sidebarType === "CLOSED") {
    return null;
  }

  return (
    <SidebarContainer>
      {sidebarType === "CHIPS" && <SidebarChips />}
      {sidebarType === "BATTERY_CHIP" && <SidebarBattery />}
    </SidebarContainer>
  );
}

export function SidebarContainer(props: { children: React.ReactNode }) {
  return <aside id="sidebar">{props.children}</aside>;
}

export function SidebarGroup(props: { children: React.ReactNode }) {
  return <div className="sidebar-group">{props.children}</div>;
}
