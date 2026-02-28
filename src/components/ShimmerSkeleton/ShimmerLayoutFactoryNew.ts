import { mainConfig } from '../../config/main';
import {
  ShimmerShape,
  ShimmerShapeCircle,
  ShimmerShapeRect,
} from './ShimmerSkeleton.types';

export type RectInput = {
  type: 'rect';
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  borderRadius?: number;
};

export type RoundInput = {
  type: 'round';
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  borderRadius?: number;
};

export type CircleInput = {
  type: 'circle';
  cx?: number;
  cy?: number;
  r?: number;
};

export type ShimmerItemInput = RectInput | RoundInput | CircleInput;

// --- Config & result ---
export type ShimmerLayoutConfig = {
  gap?: number;
  gapX?: number;
  padding?: number;
  defaultRect?: { width: number; height: number };
  defaultRoundBorderRadius?: number;
  defaultCircleR?: number;
  items: ShimmerItemInput[][];
};

export type ShimmerLayoutResult = {
  shapes: ShimmerShape[];
  metadata: {
    width: number;
    height: number;
  };
};

// --- Block = shapes in local (0,0) + size ---
export type SkeletonBlock = {
  shapes: ShimmerShape[];
  width: number;
  height: number;
};

// --- Defaults for shape creation ---
type ShapeDefaults = {
  defaultRect: { width: number; height: number };
  defaultRoundRadius: number;
  defaultCircleR: number;
};

// --- Bounds & geometry ---
function getRight(shape: ShimmerShape): number {
  if (shape.type === 'rect') return shape.x + shape.width;
  return shape.cx + shape.r;
}

function getBottom(shape: ShimmerShape): number {
  if (shape.type === 'rect') return shape.y + shape.height;
  return shape.cy + shape.r;
}

/** Build one shape from item + current position; returns shape and next X. */
function createShapeFromItem(
  item: ShimmerItemInput,
  currentX: number,
  currentY: number,
  defaults: ShapeDefaults,
  gapX: number,
): { shape: ShimmerShape; nextX: number } {
  const { defaultRect, defaultRoundRadius, defaultCircleR } = defaults;

  if (item.type === 'circle') {
    const r = item.r ?? defaultCircleR;
    const cx = item.cx ?? currentX + r;
    const cy = item.cy ?? currentY + r;
    const shape: ShimmerShapeCircle = { type: 'circle', cx, cy, r };
    return { shape, nextX: getRight(shape) + gapX };
  }

  const width = item.width ?? defaultRect.width;
  const height = item.height ?? defaultRect.height;
  const x = item.x ?? currentX;
  const y = item.y ?? currentY;
  const borderRadius =
    item.type === 'round'
      ? (item.borderRadius ?? defaultRoundRadius)
      : (item.borderRadius ?? 0);
  const shape: ShimmerShapeRect = {
    type: 'rect',
    x,
    y,
    width,
    height,
    borderRadius,
  };
  return { shape, nextX: getRight(shape) + gapX };
}

/** Offset all shapes by (dx, dy). */
function offsetShapes(
  shapes: ShimmerShape[],
  dx: number,
  dy: number,
): ShimmerShape[] {
  return shapes.map(s => {
    if (s.type === 'rect') {
      return { ...s, x: s.x + dx, y: s.y + dy };
    }
    return { ...s, cx: s.cx + dx, cy: s.cy + dy };
  });
}

// --- Primitives: one shape in local (0,0) ---
export function renderCircle(opts?: {
  r?: number;
  cx?: number;
  cy?: number;
}): SkeletonBlock {
  const r = opts?.r ?? mainConfig.SKELETON_FACTORY_DEFAULT_CIRCLE_R;
  const cx = opts?.cx ?? r;
  const cy = opts?.cy ?? r;
  const shape: ShimmerShapeCircle = { type: 'circle', cx, cy, r };
  return {
    shapes: [shape],
    width: 2 * r,
    height: 2 * r,
  };
}

export function renderRect(opts?: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  borderRadius?: number;
}): SkeletonBlock {
  const defaultRect = mainConfig.SKELETON_FACTORY_DEFAULT_RECT;
  const x = opts?.x ?? 0;
  const y = opts?.y ?? 0;
  const width = opts?.width ?? defaultRect.width;
  const height = opts?.height ?? defaultRect.height;
  const borderRadius = opts?.borderRadius ?? 0;
  const shape: ShimmerShapeRect = {
    type: 'rect',
    x,
    y,
    width,
    height,
    borderRadius,
  };
  return {
    shapes: [shape],
    width: x + width,
    height: y + height,
  };
}

export function renderRound(opts?: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  borderRadius?: number;
}): SkeletonBlock {
  const defaultRect = mainConfig.SKELETON_FACTORY_DEFAULT_RECT;
  const defaultRadius = mainConfig.SKELETON_FACTORY_DEFAULT_ROUND_BORDER_RADIUS;
  const x = opts?.x ?? 0;
  const y = opts?.y ?? 0;
  const width = opts?.width ?? defaultRect.width;
  const height = opts?.height ?? defaultRect.height;
  const borderRadius = opts?.borderRadius ?? defaultRadius;
  const shape: ShimmerShapeRect = {
    type: 'rect',
    x,
    y,
    width,
    height,
    borderRadius,
  };
  return {
    shapes: [shape],
    width: x + width,
    height: y + height,
  };
}

// --- Row: place blocks horizontally (local 0,0) ---
export function skeletonRow(
  children: SkeletonBlock[],
  options?: { gap?: number },
): SkeletonBlock {
  const gap = options?.gap ?? mainConfig.SKELETON_FACTORY_GAP;
  if (children.length === 0) {
    return { shapes: [], width: 0, height: 0 };
  }

  let x = 0;
  let maxHeight = 0;
  const shapes: ShimmerShape[] = [];

  for (const child of children) {
    shapes.push(...offsetShapes(child.shapes, x, 0));
    maxHeight = Math.max(maxHeight, child.height);
    x += child.width + gap;
  }

  return {
    shapes,
    width: x - gap,
    height: maxHeight,
  };
}

// --- Column: place blocks vertically (local 0,0) ---
export function skeletonColumn(
  children: SkeletonBlock[],
  options?: { gap?: number },
): SkeletonBlock {
  const gap = options?.gap ?? mainConfig.SKELETON_FACTORY_GAP;
  if (children.length === 0) {
    return { shapes: [], width: 0, height: 0 };
  }

  let y = 0;
  let maxWidth = 0;
  const shapes: ShimmerShape[] = [];

  for (const child of children) {
    shapes.push(...offsetShapes(child.shapes, 0, y));
    maxWidth = Math.max(maxWidth, child.width);
    y += child.height + gap;
  }

  return {
    shapes,
    width: maxWidth,
    height: y - gap,
  };
}

/** Final layout: root block + padding → shapes + metadata. */
export function renderSkeleton(
  root: SkeletonBlock,
  options?: { padding?: number },
): ShimmerLayoutResult {
  const padding = options?.padding ?? mainConfig.SKELETON_FACTORY_PADDING;

  if (root.shapes.length === 0) {
    return {
      shapes: [],
      metadata: { width: padding * 2, height: padding * 2 },
    };
  }

  const shapes = offsetShapes(root.shapes, padding, padding);
  const width = root.width + 2 * padding;
  const height = root.height + 2 * padding;

  return {
    shapes,
    metadata: { width, height },
  };
}

// --- Legacy: build from config.items (rows of items) ---
function buildRowFromItems(
  items: ShimmerItemInput[],
  defaults: ShapeDefaults,
  gapX: number,
): SkeletonBlock {
  let currentX = 0;
  const shapes: ShimmerShape[] = [];

  for (const item of items) {
    const { shape, nextX } = createShapeFromItem(
      item,
      currentX,
      0,
      defaults,
      gapX,
    );
    shapes.push(shape);
    currentX = nextX;
  }

  const width = currentX - gapX;
  const height = shapes.length > 0 ? Math.max(...shapes.map(getBottom)) : 0;

  return { shapes, width, height };
}

export function createShimmerLayout(
  config: ShimmerLayoutConfig,
): ShimmerLayoutResult {
  const gap = config.gap ?? mainConfig.SKELETON_FACTORY_GAP;
  const gapX = config.gapX ?? gap;
  const padding = config.padding ?? mainConfig.SKELETON_FACTORY_PADDING;
  const defaults: ShapeDefaults = {
    defaultRect: config.defaultRect ?? mainConfig.SKELETON_FACTORY_DEFAULT_RECT,
    defaultRoundRadius:
      config.defaultRoundBorderRadius ??
      mainConfig.SKELETON_FACTORY_DEFAULT_ROUND_BORDER_RADIUS,
    defaultCircleR:
      config.defaultCircleR ?? mainConfig.SKELETON_FACTORY_DEFAULT_CIRCLE_R,
  };

  const rowBlocks = config.items.map(rowItems =>
    buildRowFromItems(rowItems, defaults, gapX),
  );
  const columnBlock = skeletonColumn(rowBlocks, { gap });
  return renderSkeleton(columnBlock, { padding });
}
