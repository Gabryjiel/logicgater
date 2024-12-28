import "./styles/index.css";
import "./styles/app.css";

import { useAppSelector } from "./providers/redux";
import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { ProcessorBoard } from "./nodes/Processor";

export function App() {
  const motherboard = useAppSelector((state) => state.motherboard);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    if (!event.currentTarget.classList.contains("container")) {
      return;
    }
    setIsSidebarOpen(false);
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsSidebarOpen(true);
  };

  const handleKeyUp: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    if (!event.currentTarget.classList.contains("container")) {
      return;
    }
    setIsSidebarOpen(false);
  };

  return (
    <div
      className="container"
      onClick={handleClick}
      onKeyUp={handleKeyUp}
      onContextMenu={handleContextMenu}
    >
      <Sidebar isOpen={isSidebarOpen} />
      <ProcessorBoard chip={motherboard} />
    </div>
  );
}
