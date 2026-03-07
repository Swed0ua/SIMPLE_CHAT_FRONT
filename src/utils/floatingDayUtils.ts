import { Message } from '../store/slices/messagesSlice';
import { getDayKey } from './timeFormating';

const TOP_OFFSET_PX = 30;

function getItemTopInContent(
  index: number,
  heights: Record<number, number>,
  contentHeight: number,
): number {
  let sum = 0;
  for (let i = 0; i <= index; i++) {
    sum += heights[i] ?? 0;
  }
  return contentHeight - sum;
}

export type DividerPosition = {
  topY: number;
  dateKey: string;
  nextDateKey: string;
};

export function buildDividerPositions(
  itemHeights: Record<number, number>,
  contentHeight: number,
  dayDividerIndices: number[],
  displayList: Message[],
): DividerPosition[] {
  if (dayDividerIndices.length === 0 || contentHeight <= 0) return [];
  const positions: DividerPosition[] = [];
  for (let i = 0; i < dayDividerIndices.length; i++) {
    const divIdx = dayDividerIndices[i];
    const item = displayList[divIdx];
    if (
      item?.isSystemMessage &&
      item.systemMessageData?.type === 'DayDivider' &&
      'dateKey' in item.systemMessageData
    ) {
      const nextItem = displayList[divIdx + 1];
      const nextDateKey =
        nextItem?.createdAt != null
          ? getDayKey(nextItem.createdAt)
          : item.systemMessageData.dateKey;
      positions.push({
        topY: getItemTopInContent(divIdx, itemHeights, contentHeight),
        dateKey: item.systemMessageData.dateKey,
        nextDateKey,
      });
    }
  }
  return positions;
}

export type FloatingDayResult = {
  dateKey: string | null;
  distanceToNearestDivider: number;
};

/**
 * Returns current day key and signed distance to nearest divider.
 * Uses binary search — O(log n). Positions must be sorted by topY descending.
 */
export function getFloatingDayKeyFromPositions(
  scrollY: number,
  positions: DividerPosition[],
  topOffsetPx: number = TOP_OFFSET_PX,
): FloatingDayResult {
  if (positions.length === 0) {
    return { dateKey: null, distanceToNearestDivider: 0 };
  }

  const threshold = scrollY + topOffsetPx;

  // First index i where positions[i].topY < threshold (positions sorted descending)
  let low = 0;
  let high = positions.length;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (positions[mid].topY < threshold) high = mid;
    else low = mid + 1;
  }
  const dateKey = low > 0 ? positions[low - 1].nextDateKey : null;

  // First index i where positions[i].topY < scrollY (bracket scrollY for nearest)
  low = 0;
  high = positions.length;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (positions[mid].topY < scrollY) high = mid;
    else low = mid + 1;
  }
  let distanceToNearestDivider: number;
  if (low === 0) {
    distanceToNearestDivider = positions[0].topY - scrollY;
  } else if (low === positions.length) {
    distanceToNearestDivider = positions[positions.length - 1].topY - scrollY;
  } else {
    const dAbove = positions[low - 1].topY - scrollY;
    const dBelow = scrollY - positions[low].topY;
    distanceToNearestDivider = dAbove <= dBelow ? dAbove : -dBelow;
  }

  return { dateKey, distanceToNearestDivider };
}

/**
 * Same as getFloatingDayKeyFromPositions but with linear scan — O(n).
 * Kept for reference; not used in app.
 */
export function getFloatingDayKeyFromPositionsOLD(
  scrollY: number,
  positions: DividerPosition[],
  topOffsetPx: number = TOP_OFFSET_PX,
): FloatingDayResult {
  let dateKey: string | null = null;
  let foundTopY = Infinity;
  let distanceToNearestDivider = Infinity;

  for (let i = 0; i < positions.length; i++) {
    const p = positions[i];
    const d = p.topY - scrollY;

    if (Math.abs(d) < Math.abs(distanceToNearestDivider)) {
      distanceToNearestDivider = d;
    }
    if (p.topY >= scrollY + topOffsetPx && p.topY < foundTopY) {
      foundTopY = p.topY;
      dateKey = p.nextDateKey;
    }
  }

  return {
    dateKey,
    distanceToNearestDivider:
      distanceToNearestDivider === Infinity ? 0 : distanceToNearestDivider,
  };
}
