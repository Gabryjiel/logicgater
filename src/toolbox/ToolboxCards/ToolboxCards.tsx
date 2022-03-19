import ToolboxCard from "../ToolboxCard";
import { Views } from "../ViewsEnum";
import style from "./ToolboxCards.module.scss";

interface ToolboxCardsProps {
  onClick: (event: React.MouseEvent) => void;
  onKeyPress: (event: React.KeyboardEvent) => void;
  active: number;
}

export default function ToolboxCards(props: ToolboxCardsProps) {
  return (
    <div id="toolbox-cards" className={style.cards} role="navigation">
      <ToolboxCard
        name="Gates"
        value={Views.GATES}
        onClick={props.onClick}
        onKeyPress={props.onKeyPress}
      />
      <ToolboxCard
        name="Sources"
        value={Views.SOURCES}
        onClick={props.onClick}
        onKeyPress={props.onKeyPress}
      />
      <ToolboxCard
        name="Outputs"
        value={Views.OUTPUTS}
        onClick={props.onClick}
        onKeyPress={props.onKeyPress}
      />
    </div>
  );
}
