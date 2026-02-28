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

export type ShimmerShapeArea = {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  fillCrossAxis?: boolean;
};

export type CrossAlign = 'start' | 'center' | 'end';

export type ShimmerShape = ShimmerShapeRect | ShimmerShapeCircle;

export type LayoutDefaults = {
  gap?: number;
  padding?: number;
  alignItems?: CrossAlign;
};
