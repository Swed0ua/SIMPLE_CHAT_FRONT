import { MESSAGES_CONFIG } from '../../config/mesages';
import {
  renderCircle,
  renderRound,
  renderSkeleton,
  skeletonColumn,
  skeletonRow,
} from '../ShimmerSkeleton/ShimmerLayoutFactoryNew';
import {
  ChatDetailsLayoutBuilder,
  ChatDetailsSkeletonVariant,
} from './ChatDetailsSkeleton.types';

const MESSAGE_HEIGHT = MESSAGES_CONFIG.skeleton.MESSAGE_HEIGHT;
const MESSAGE_GAP = MESSAGES_CONFIG.skeleton.MESSAGE_GAP;
const MESSAGE_PADDING = MESSAGES_CONFIG.skeleton.MESSAGE_PADDING;
const MESSAGE_GAP_X = MESSAGES_CONFIG.skeleton.MESSAGE_GAP_X;

function getRowCount(height: number): number {
  return Math.ceil(height / (MESSAGE_HEIGHT + MESSAGE_GAP + MESSAGE_PADDING));
}

function getMessageWidth(screenWidth: number, factor = 0.7): number {
  return screenWidth * factor;
}

function createMessageBubbleBlock(
  messageWidth: number,
  additionalProps: Record<string, any> = {},
) {
  return renderRound({
    width: messageWidth,
    height: MESSAGE_HEIGHT,
    ...additionalProps,
  });
}

export const buildMultipleLayout: ChatDetailsLayoutBuilder = ({
  width,
  height,
}) => {
  const messageWidth = getMessageWidth(width);
  const count = getRowCount(height);

  const rowBlocks = Array.from({ length: count }, (_, index) => {
    if (index % 3 === 0) {
      return createMessageBubbleBlock(messageWidth, {
        x: getMessageWidth(width, 0.3) - MESSAGE_PADDING * 2,
      });
    }
    return skeletonRow(
      [renderCircle(), createMessageBubbleBlock(messageWidth)],
      {
        gap: MESSAGE_GAP_X,
      },
    );
  });

  const root = skeletonColumn(rowBlocks, {
    gap: MESSAGE_GAP,
  });
  return renderSkeleton(root, {
    padding: MESSAGE_PADDING,
  });
};

export const buildSingleLayout: ChatDetailsLayoutBuilder = ({
  width,
  height,
}) => {
  const messageWidth = getMessageWidth(width);
  const count = getRowCount(height);

  const rowBlocks = Array.from({ length: count }, (_, index) => {
    if (index % 3 === 0) {
      return createMessageBubbleBlock(messageWidth, {
        x: getMessageWidth(width, 0.3) - MESSAGE_PADDING * 2,
      });
    }
    return createMessageBubbleBlock(messageWidth);
  });

  const root = skeletonColumn(rowBlocks, {
    gap: MESSAGE_GAP,
  });
  return renderSkeleton(root, {
    padding: MESSAGE_PADDING,
  });
};

export const LAYOUT_BUILDERS: Record<
  ChatDetailsSkeletonVariant,
  ChatDetailsLayoutBuilder
> = {
  multiple: buildMultipleLayout,
  single: buildSingleLayout,
};
