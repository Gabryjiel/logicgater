import "./styles/app.css";
import "./styles/index.css";
import "./styles/position.css";

import { Sidebars } from "./components/Sidebars";
import type { ChipId } from "./nodes";
import { ProcessorBoard } from "./nodes/Processor";
import { useAppSelector } from "./providers/redux";

export function App() {
  const chips = useAppSelector((state) =>
    Object.values(state.chips).map((chip) => ({
      chipId: chip.id,
      type: chip.type,
      position: chip.position,
    })),
  );

  const connections = useAppSelector((state) => state.connections);

  return (
    <div className="container">
      <Sidebars />
      <ProcessorBoard
        chips={chips}
        chipId={"motherboard" as ChipId}
        connections={connections}
      />
      <Position />
    </div>
  );
}

function Position() {
  const lastClickedPosition = useAppSelector((state) => state.utils);

  if (lastClickedPosition === null) {
    return;
  }

  return (
    <div className="position">
      ({lastClickedPosition.processorId}) X: {lastClickedPosition.x}, Y:{" "}
      {lastClickedPosition.y}
    </div>
  );
}
