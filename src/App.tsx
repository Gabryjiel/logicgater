import "./styles/app.css";
import "./styles/index.css";
import "./styles/position.css";

import { useEffect } from "react";
import { Sidebars } from "./components/Sidebars";
import type { ChipId } from "./nodes";
import { ProcessorBoard } from "./nodes/Processor";
import { useAppDispatch, useAppSelector } from "./providers/redux";
import { close } from "./providers/redux/sidebar";

export function App() {
  const dispatch = useAppDispatch();
  const chips = useAppSelector((state) =>
    Object.values(state.chips).map((chip) => ({
      chipId: chip.id,
      type: chip.type,
      position: chip.position,
    })),
  );

  const connections = useAppSelector((state) => state.connections);
  const sidebar = useAppSelector((state) => state.sidebar);

  useEffect(() => {
    const abortController = new AbortController();

    document.addEventListener("keyup", (event) => {
      if (event.key === 'Escape' && sidebar !== null) {
        dispatch(close());
      }
    }, {
      signal: abortController.signal,
    });

    return () => {
      abortController.abort();
    };
  }, [dispatch, sidebar]);

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
