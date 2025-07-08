import { useAppDispatch, useAppSelector } from "../providers/redux";
import { SidebarBattery } from "./SidebarBattery";
import { SidebarChips } from "./SidebarChips";
import { IoHome } from "react-icons/io5";

import "./sidebars.css";
import { SidebarSlice } from "../providers/redux/sidebar";

export function Sidebars() {
  const sidebar = useAppSelector((state) => state.sidebar);

  if (sidebar === null) {
    return null;
  }

  return (
    <SidebarContainer>
      {sidebar.type === "CHIPS" && <SidebarChips />}
      {sidebar.type === "BATTERY" && <SidebarBattery />}
    </SidebarContainer>
  );
}

export function SidebarContainer(props: { children: React.ReactNode }) {
  return <aside id="sidebar">{props.children}</aside>;
}

export function SidebarGroup(props: { children: React.ReactNode }) {
  return <div className="sidebar-group">{props.children}</div>;
}

export function SidebarHeader(props: { title: string }) {
  const dispatch = useAppDispatch();

  const onCloseClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    dispatch(SidebarSlice.actions.close());
  };

  return (
    <div className="sidebar-header">
      <h3>{props.title}</h3>

      <button id="close-sidebar-button" onClick={onCloseClick} type="button">
        <IoHome />
      </button>
    </div>
  );
}
