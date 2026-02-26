export type ShimmerShapeRect = {
  type: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius?: number;
};

export type ShimmerShapeCircle = {
  type: 'circle';
  cx: number;
  cy: number;
  r: number;
};

export type ShimmerShape = ShimmerShapeRect | ShimmerShapeCircle;
