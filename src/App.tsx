import "./styles/index.css";
import "./styles/app.css";

import { useAppSelector } from "./providers/redux";
import { ProcessorBoard } from "./nodes/Processor";
import type { ChipId } from "./nodes";
import { Sidebars } from "./components/Sidebars";

export function App() {
  const chips = useAppSelector((state) => Object.values(state.chips).map((chip) => ({
    chipId: chip.id,
    type: chip.type,
  })));

  const connections = useAppSelector((state) => state.connections);

  return (
    <div className="container">
      <Sidebars />
      <ProcessorBoard
        chips={chips}
        chipId={"motherboard" as ChipId}
        connections={connections}
      />
    </div>
  );
}
