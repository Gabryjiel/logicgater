import "./styles/index.css";
import "./styles/app.css";

import { useAppSelector } from "./providers/redux";
import { Sidebar } from "./components/Sidebar";
import { ProcessorBoard } from "./nodes/Processor";
import type { ChipId } from "./nodes";

export function App() {
  const motherboard = useAppSelector((state) => state.motherboard);
  const isSidebarOpen = useAppSelector(
    (state) => state.motherboard.isSidebarOpen,
  );

  return (
    <div className="container">
      <Sidebar isOpen={isSidebarOpen} />
      <ProcessorBoard
        chips={Object.values(motherboard.chips).map((chip) => ({
          chipId: chip.id,
          type: chip.type,
        }))}
        chipId={"motherboard" as ChipId}
        connections={motherboard.connections}
      />
    </div>
  );
}
