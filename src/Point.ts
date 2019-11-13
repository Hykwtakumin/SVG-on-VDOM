export type Points = {
  x: number;
  y: number;
};

export const getPoint = (
  pageX: number,
  pageY: number,
  targetDomRect: SVGElement | SVGSVGElement
): Points => {
  let x, y;
  let rect = targetDomRect.getBoundingClientRect();
  let dx = rect.left + window.pageXOffset;
  let dy = rect.top + window.pageYOffset;
  x = pageX - dx;
  y = pageY - dy;
  return { x, y };
};
