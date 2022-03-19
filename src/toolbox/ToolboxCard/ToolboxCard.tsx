import style from "./ToolboxCard.module.scss";

interface ToolboxCardProps {
  value: number;
  name: string;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  onKeyPress: (value: React.KeyboardEvent<HTMLDivElement>) => void;
}

export default function ToolboxCard(props: ToolboxCardProps) {
  return (
    <div
      className={style.card}
      data-value={props.value}
      role="menuitem"
      tabIndex={0}
      onClick={props.onClick}
      onKeyPress={props.onKeyPress}
    >
      {props.name}
    </div>
  );
}
