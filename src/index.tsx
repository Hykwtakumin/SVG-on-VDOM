import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import { PathDrawer } from "./PathDrawer";

import "./styles.css";

export type drawPoint = {
  x: number;
  y: number;
};

export type oneStroke = {
  id: string;
  points: drawPoint[];
};

function App() {
  const [pathObjects, setPathObjects] = useState<oneStroke[]>([]);
  const [points, setPoints] = useState<drawPoint[]>([]);

  const isDragging = useRef<boolean>(false);

  //let isDragging: boolean = false;
  const tempPoints: drawPoint[] = [];

  const handleDown = (event: React.PointerEvent<SVGSVGElement>) => {
    //新しいPathObjectを生成する
    //ただし描画はReactにまかせる
    isDragging.current = true;
    event.persist();
    // const newOneStroke: oneStroke = {
    //   id: shortId(),
    //   points: []
    // };
    // setPathObjects(Object.assign(pathObjects, newOneStroke));
    const newPoint: drawPoint = {
      x: event.pageX,
      y: event.pageY
    };
    //tempPoints.push(newPoint);
    //console.dir(tempPoints);
    // const newPoints = points.push(newPoint);
    // setPoints(Object.assign(points, newPoints));
    setPoints([...points, newPoint]);
  };

  const handleMove = (event: React.PointerEvent<SVGSVGElement>) => {
    //最新のPathを操作する
    if (isDragging.current) {
      //event.persist();
      console.log("handle Move");
      const newPoint: drawPoint = {
        x: event.pageX,
        y: event.pageY
      };
      //tempPoints.push(newPoint);
      //console.dir(tempPoints);

      //const newPoints = points.push(newPoint);
      //setPoints(Object.assign(points, newPoints));
      setPoints([...points, newPoint]);
      //setPoints(...points, newPoints);
      console.dir(points);

      // const lastPath: oneStroke = pathObjects[pathObjects.length];
      // if (lastPath) {
      //   const newPoint: drawPoint = {
      //     x: event.pageX,
      //     y: event.pageY
      //   };
      //   // lastPath.points.push(newPoint);
      //   // setPathObjects(object.assign(pathObjects, lastPath));
      //   // const newPoints = points.push(newPoint);
      //   // setPoints(Object.assign(points, newPoints));
      //   tempPoints.push(newPoint);
      // } else {
      //   console.log("lastPath is not found!");
      // }
    }
  };

  const handleUp = (event: React.PointerEvent<SVGSVGElement>) => {
    //操作を中断する
    isDragging.current = false;
    // if (tempPoints && tempPoints.length > 0) {
    //   //setPoints(tempPoints);
    //   //tempPoints.length = 0;
    // }

    //setPoints(prevPoints => {});

    console.log(`points: ${points.length}`);
  };

  return (
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
    </svg>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
