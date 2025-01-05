import "./styles/index.css";
import "./styles/app.css";

import { useAppSelector } from "./providers/redux";
import { ProcessorBoard } from "./nodes/Processor";
import type { ChipId } from "./nodes";
import { Sidebars } from "./components/Sidebars";

export function App() {
  const motherboard = useAppSelector((state) => state.motherboard);

  return (
    <div className="container">
      <Sidebars />
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
