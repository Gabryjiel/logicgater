import { useState } from "react";

import style from "./Toolbox.module.scss";
import ToolboxCards from "./ToolboxCards";
import ToolboxContent from "./ToolboxContent";
import { Views } from "./ViewsEnum";

export default function Toolbox() {
  const [view, setView] = useState(Views.HIDDEN);

  const handleViewChange = (newView: Views) => {
    if (view === newView) {
      setView(Views.HIDDEN);
    } else {
      setView(newView);
    }
  };

  const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
    const element = event.target as HTMLDivElement;
    const newView = element.dataset.value;

    if (newView) {
      handleViewChange(Number(newView));
    }
  };

  return (
    <aside className={style.toolbox}>
      <ToolboxCards
        active={view}
        onClick={handleClick}
        onKeyPress={handleClick}
      />
      <ToolboxContent hidden={view === Views.HIDDEN} active={view} />
    </aside>
  );
}
