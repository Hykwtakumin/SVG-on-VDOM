import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import { PathDrawer } from "./PathDrawer";
import { StrokeDrawer } from "./StrokeDrawer";
import "./styles.css";
import { GroupDrawer, Group } from "./GroupDrawer";
import { Dialog } from "./Dialog";

export type drawPoint = {
  x: number;
  y: number;
};

export type Stroke = {
  id: string;
  points: drawPoint[];
};

export type PointerEvents = "none" | "auto";

function App() {
  //リアルタイムで描画する座標
  const [points, setPoints] = useState<drawPoint[]>([]);
  //通常のストローク
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  //グループ化した要素たち
  const [groups, setGroups] = useState<Group[]>([]);
  //ドラッグ中のboolean
  const [isDragging, setIsDragging] = useState<boolean>(false);
  //要素のpointer-events
  const [events, setEvents] = useState<PointerEvents>("none");
  //モーダルの表示
  const [isOpen, setIsOpen] = useState<boolean>(false);

  //stateではなく一時変数で管理する場合はRefを利用すると常に最新値にアクセスできる
  //const isDragging = useRef<boolean>(false);

  const handleDown = (event: React.PointerEvent<SVGSVGElement>) => {
    //isDragging.current = true;
    setIsDragging(true);

    const newPoint: drawPoint = {
      x: Math.floor(event.pageX),
      y: Math.floor(event.pageY)
    };

    setPoints([...points, newPoint]);
  };

  const handleMove = (event: React.PointerEvent<SVGSVGElement>) => {
    //if (isDragging.current) {
    if (isDragging) {
      const newPoint: drawPoint = {
        x: Math.floor(event.pageX),
        y: Math.floor(event.pageY)
      };
      setPoints([...points, newPoint]);
    }
  };

  const handleUp = (event: React.PointerEvent<SVGSVGElement>) => {
    //isDragging.current = false;
    setIsDragging(false);
    const newStroke: Stroke = {
      id: `${event.pressure}`,
      points: points
    };

    setStrokes([...strokes, newStroke]);

    //pointsはリセットする
    setPoints([]);
  };

  //元に戻す
  const handleUndo = event => {
    const newStrokes = strokes.filter((stroke, index) => {
      return index !== strokes.length - 1;
    });
    setStrokes(newStrokes);
  };

  //消去する前にダイアログを表示する
  const handleClearDialog = event => {};

  //全部消去
  const handleAllClear = () => {
    setStrokes([]);
    setIsOpen(false);
  };

  return (
    <div
      style={{
        border: "solid 1px black",
        touchAction: "none"
      }}
    >
      <svg
        id={"mainCanvas"}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
        width={"800"}
        height={"600"}
        style={{
          border: "solid 1px black",
          touchAction: "none"
        }}
      >
        <PathDrawer points={points} />
        <StrokeDrawer strokes={strokes} />
        <GroupDrawer groups={[]} />
      </svg>
      <input type={"button"} value={"元に戻す"} onClick={handleUndo} />
      <input
        type={"button"}
        value={"リセット"}
        onClick={() => {
          setIsOpen(true);
        }}
      />
      <Dialog
        isShow={isOpen}
        onOk={handleAllClear}
        onCancel={() => {
          setIsOpen(false);
        }}
      />
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
