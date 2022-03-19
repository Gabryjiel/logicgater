import Toolbox from "../toolbox/Toolbox";
import style from "./View.module.scss";

export default function View() {
  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log(event.dataTransfer.getData("element"));
  };
  return (
    <div className={style.view}>
      <Toolbox />
      <main
        className={style.main}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      ></main>
    </div>
  );
}
