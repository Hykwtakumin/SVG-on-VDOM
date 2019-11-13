import * as React from "react";
import { FC } from "react";
import { Stroke, PointerEvents } from "./index";
import { StrokeDrawer } from "./StrokeDrawer";

//グループ化について
export type Group = {
  id: string;
  href: string;
  strokes: Stroke[];
  style: string;
  transform: string;
};

export type GroupDrawerProps = {
  groups: Group[];
  events: PointerEvents;
};

//グループ化した要素をまとめて扱うコンポーネント
//リンクをホバーしたりクリックしたら情報を表示する?
export const GroupDrawer: FC<GroupDrawerProps> = props => {
  const handleLinkHover = (href: string) => {
    console.log(`次のリンクが設定されています:${href}`);
  };

  return (
    <>
      {props.groups.map((group, index) => {
        return (
          <a id={group.id} key={index} href={group.href} target={"blank"}>
            <g transform={group.transform} pointerEvents={props.events}>
              <StrokeDrawer strokes={group.strokes} events={props.events} />
            </g>
          </a>
        );
      })}
    </>
  );
};
