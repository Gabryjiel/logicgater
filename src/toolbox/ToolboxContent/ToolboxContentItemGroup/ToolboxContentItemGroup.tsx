import { ContentItemGroup } from "../../ToolboxTypes";
import ToolboxContentItem from "../ToolboxContentItem/ToolboxContentItem";
import style from "./ToolboxContentItemGroup.module.scss";

interface ToolboxContentItemGroupProps {
  group: ContentItemGroup;
}

export default function ToolboxContentItemGroup(
  props: ToolboxContentItemGroupProps
) {
  return (
    <div className={style.group}>
      <div className={style.title}>{props.group.title}</div>
      <div className={style.items}>
        {props.group.items.map((item, idx) => {
          return (
            <ToolboxContentItem
              key={props.group.title + item.name + idx}
              {...item}
            />
          );
        })}
      </div>
    </div>
  );
}
