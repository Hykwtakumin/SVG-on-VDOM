import * as React from "react";
import { FC } from "react";
import { Stroke, PointerEvents } from "./index";
import { StrokeDrawer } from "./StrokeDrawer";

//グループ化について
export type Group = {
  id: string;
  href: string;
  strokes: Stroke[];
  transform: string;
  events: PointerEvents;
};

export type GroupDrawerProps = {
  groups: Group[];
  events: PointerEvents;
};

//グループ化した要素をまとめて扱うコンポーネント
export const GroupDrawer: FC<GroupDrawerProps> = props => {
  return (
    <>
      {props.groups.map((group, index) => {
        return (
          <a id={group.id} key={index} href={group.href} target={"blank"}>
            <g transform={group.transform}>
              <StrokeDrawer strokes={group.strokes} events={props.events} />
            </g>
          </a>
        );
      })}
    </>
  );
};
