import * as React from "react";
import { drawPoint, Stroke } from "./index";
import { FC } from "react";

export type StrokeDrawerProps = {
  strokes: Stroke[];
};

//描かれたPathをまとめて管理するComponent
export const StrokeDrawer: FC<StrokeDrawerProps> = props => {
  return (
    <>
      {props.strokes.map((stroke, index) => {
        const initialPoint: drawPoint = stroke.points[0] || { x: 0, y: 0 };

        const LineToPoints = stroke.points.map((point, index) => {
          if (index > 0) {
            return `L ${point.x} ${point.y} `;
          }
        });

        return (
          <path
            strokeLinejoin={"round"}
            strokeLinecap={"round"}
            stroke={"#585858"}
            strokeWidth={"6"}
            pointerEvents={"none"}
            fill={"rgba(0,0,0,0)"}
            id={stroke.id}
            key={stroke.id}
            d={`M ${initialPoint.x} ${initialPoint.y} ${LineToPoints}`}
          />
        );
      })}
      <path />
    </>
  );
};
