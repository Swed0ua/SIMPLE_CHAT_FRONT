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

export function getFloatingDayKeyFromPositions(
  scrollY: number,
  positions: DividerPosition[],
  topOffsetPx: number = TOP_OFFSET_PX,
): string | null {
  if (positions.length === 0) return null;
  let found: DividerPosition | null = null;
  for (let i = 0; i < positions.length; i++) {
    const p = positions[i];
    if (
      p.topY >= scrollY + topOffsetPx &&
      (found === null || p.topY < found.topY)
    ) {
      found = p;
    }
  }
  return found?.nextDateKey ?? null;
}
