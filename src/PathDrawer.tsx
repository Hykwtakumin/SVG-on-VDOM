import * as React from "react";
import { drawPoint } from "./index";
import { FC } from "react";

export type PathDrawerProps = {
  points: drawPoint[];
};

export const PathDrawer: FC<PathDrawerProps> = props => {
  const initialPoint: drawPoint = props.points[0] || { x: 0, y: 0 };

  const LineToPoints = props.points.map((point, index) => {
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
      d={`M ${initialPoint.x} ${initialPoint.y} ${LineToPoints}`}
    />
  );
};
