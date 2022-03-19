import style from "./ToolboxContentItem.module.scss";

interface ToolboxContentItem {
  label: string;
  name: string;
  icon: string;
}

export default function ToolboxContentItem(props: ToolboxContentItem) {
  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("element", props.name);
  };

  return (
    <div className={style.wrapper}>
      <div
        draggable
        className={style.item}
        title={props.label}
        onDragStart={handleDragStart}
      >
        {props.icon}
      </div>
    </div>
  );
}
