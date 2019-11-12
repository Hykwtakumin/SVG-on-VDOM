import * as React from "react";
import { FC } from "react";

export type BoundingBoxProps = {
  left: number;
  top: number;
  width: number;
  height: number;
  onAddLink: () => void;
};

export const BoundingBox: FC<BoundingBoxProps> = props => {
  return <></>;
};
