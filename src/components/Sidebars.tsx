import { IoHome } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../providers/redux";
import { SidebarBattery } from "./SidebarBattery";
import { SidebarChips } from "./SidebarChips";

import "./sidebars.css";
import { focusMarker } from "../providers/redux/marker";
import { close, SidebarSlice } from "../providers/redux/sidebar";
import { useEffect, useRef } from "react";

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
  const ref = useRef<HTMLElement>(null);
  const sidebar = useAppSelector((state) => state.sidebar);
  const dispatch = useAppDispatch();

  const handleKeyUp: React.KeyboardEventHandler<HTMLElement> = (event) => {
    console.log(event);
    if (event.key === "Escape") {
      dispatch(close());
      dispatch(focusMarker());
    }
  };

  useEffect(() => {
    ref.current?.focus();
  }, [sidebar?.type])

  return (
    <aside id="sidebar" ref={ref} onKeyUp={handleKeyUp} tabIndex={-1}>
      {props.children}
    </aside>
  );
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
