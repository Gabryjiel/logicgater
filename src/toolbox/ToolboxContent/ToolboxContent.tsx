import { GatesGroups, OutputGroups, SourcesGroups } from "../ToolboxItems";
import { Views } from "../ViewsEnum";
import style from "./ToolboxContent.module.scss";
import ToolboxContentItemGroup from "./ToolboxContentItemGroup";

interface ToolboxContentProps {
  hidden: boolean;
  active: Views;
}

export default function ToolboxContent(props: ToolboxContentProps) {
  const getContent = () => {
    switch (props.active) {
      case Views.GATES:
        return GatesGroups;
      case Views.SOURCES:
        return SourcesGroups;
      case Views.OUTPUTS:
        return OutputGroups;
      default:
        return [];
    }
  };

  return (
    <div
      id="toolbox-content"
      className={style.content}
      data-hidden={props.hidden}
    >
      {getContent().map(group => {
        return (
          <ToolboxContentItemGroup
            key={`toolbox-content-${group.title}`}
            group={group}
          />
        );
      })}
    </div>
  );
}
