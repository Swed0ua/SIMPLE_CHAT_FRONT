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

function getRectBottom(shape: ShimmerShapeRect): number {
  return shape.y + shape.height;
}

function getCircleBottom(shape: ShimmerShapeCircle): number {
  return shape.cy + shape.r;
}

function getRight(shape: ShimmerShape): number {
  if (shape.type === 'rect') {
    return shape.x + shape.width;
  } else if (shape.type === 'circle') {
    return shape.cx + shape.r;
  }
  return 0;
}

function getBottom(shape: ShimmerShape): number {
  if (shape.type === 'rect') {
    return getRectBottom(shape);
  } else if (shape.type === 'circle') {
    return getCircleBottom(shape);
  }
  return 0;
}

export function createShimmerLayout(
  config: ShimmerLayoutConfig,
): ShimmerLayoutResult {
  const gap = config.gap ?? mainConfig.SKELETON_FACTORY_GAP;
  const gapX = config.gapX ?? gap;
  const padding = config.padding ?? mainConfig.SKELETON_FACTORY_PADDING;
  const defaultRect =
    config.defaultRect ?? mainConfig.SKELETON_FACTORY_DEFAULT_RECT;
  const defaultRoundRadius =
    config.defaultRoundBorderRadius ??
    mainConfig.SKELETON_FACTORY_DEFAULT_ROUND_BORDER_RADIUS;
  const defaultCircleR =
    config.defaultCircleR ?? mainConfig.SKELETON_FACTORY_DEFAULT_CIRCLE_R;

  // Offset from the top side of the component
  let currentY = padding;
  const shapes: ShimmerShape[] = [];

  for (const itemArr of config.items) {
    // Offset from the left side of the component
    let currentZ = padding;
    for (const item of itemArr) {
      if (item.type === 'circle') {
        const r = item.r ?? defaultCircleR;
        const cx = item.cx ?? currentZ + r;
        const cy = item.cy ?? currentY + r;
        const shape: ShimmerShapeCircle = { type: 'circle', cx, cy, r };
        shapes.push(shape);
      } else {
        const width = item.width ?? defaultRect.width;
        const height = item.height ?? defaultRect.height;
        const x = item.x ?? currentZ;
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
        shapes.push(shape);
      }
      currentZ = getRight(shapes[shapes.length - 1]!) + gapX;
    }
    currentY = getBottom(shapes[shapes.length - 1]!) + gap;
  }

  const contentBottom = currentY - gap;
  const allPoints = shapes.flatMap(s => {
    if (s.type === 'rect') {
      return [
        { left: s.x, right: s.x + s.width, top: s.y, bottom: s.y + s.height },
      ];
    }
    return [
      {
        left: s.cx - s.r,
        right: s.cx + s.r,
        top: s.cy - s.r,
        bottom: s.cy + s.r,
      },
    ];
  });

  const minX = Math.min(...allPoints.map(p => p.left));
  const maxX = Math.max(...allPoints.map(p => p.right));
  const width = maxX - minX + 2 * padding;
  const height = contentBottom + padding;

  return {
    shapes,
    metadata: { width, height },
  };
}
