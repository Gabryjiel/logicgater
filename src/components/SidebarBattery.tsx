import { useAppSelector } from "../providers/redux";
import { SidebarGroup, SidebarHeader } from "./Sidebars";

export function SidebarBattery() {
  const battery = useAppSelector((state) => state.motherboard.chips);

  return (
    <>
      <SidebarHeader title="Battery" />
      <SidebarGroup>
        <input type="text" placeholder="Name" />
      </SidebarGroup>
    </>
  );
}
