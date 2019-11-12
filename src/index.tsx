import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import { PathDrawer } from "./PathDrawer";
import { StrokeDrawer } from "./StrokeDrawer";

import "./styles.css";

export type drawPoint = {
  x: number;
  y: number;
};

export type Stroke = {
  id: string;
  points: drawPoint[];
};

function App() {
  const [points, setPoints] = useState<drawPoint[]>([]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);

  const isDragging = useRef<boolean>(false);

  const handleDown = (event: React.PointerEvent<SVGSVGElement>) => {
    isDragging.current = true;

    const newPoint: drawPoint = {
      x: Math.floor(event.pageX),
      y: Math.floor(event.pageY)
    };

    setPoints([...points, newPoint]);
  };

  const handleMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (isDragging.current) {
      const newPoint: drawPoint = {
        x: Math.floor(event.pageX),
        y: Math.floor(event.pageY)
      };
      setPoints([...points, newPoint]);
    }
  };

  const handleUp = (event: React.PointerEvent<SVGSVGElement>) => {
    isDragging.current = false;
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
      </svg>
      <input type={"button"} value={"元に戻す"} onClick={handleUndo} />
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
