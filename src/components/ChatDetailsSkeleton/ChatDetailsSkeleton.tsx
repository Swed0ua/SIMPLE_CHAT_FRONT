import React, { useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';
import ShimmerSkeletonGroup from '../ShimmerSkeleton/ShimmerSkeletonGroup';
import {
  createShimmerLayout,
  ShimmerItemInput,
} from '../ShimmerSkeleton/ShimmerLayoutFactory';
import { MESSAGES_CONFIG } from '../../config/mesages';

export default function ChatDetailsSkeleton() {
  const { width, height } = useWindowDimensions();

  const { shapes, metadata } = useMemo(() => {
    const messageWidth = width * 0.7;
    const count = Math.ceil(
      height /
        (MESSAGES_CONFIG.skeleton.MESSAGE_HEIGHT +
          MESSAGES_CONFIG.skeleton.MESSAGE_GAP +
          MESSAGES_CONFIG.skeleton.MESSAGE_PADDING),
    );

    const getSkeletonItem = (index: number): ShimmerItemInput[] => {
      // Check item position and render as own message else default as guest message
      const item = {
        type: 'rect' as const,
        width: messageWidth,
        height: MESSAGES_CONFIG.skeleton.MESSAGE_HEIGHT,
      };
      if (index % 3 === 0) {
        return [
          {
            ...item,
            x: width * 0.3 - MESSAGES_CONFIG.skeleton.MESSAGE_PADDING,
            type: 'round' as const,
          },
        ];
      }
      return [
        {
          ...item,
          type: 'circle' as const,
        },
        {
          ...item,

          type: 'round' as const,
        },
      ];
    };

    const items: ShimmerItemInput[][] = Array.from(
      { length: count },
      (_, index) => getSkeletonItem(index),
    );
    return createShimmerLayout({
      items,
      gap: MESSAGES_CONFIG.skeleton.MESSAGE_GAP,
      gapX: MESSAGES_CONFIG.skeleton.MESSAGE_GAP_X,
      padding: MESSAGES_CONFIG.skeleton.MESSAGE_PADDING,
    });
  }, [width, height]);

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <View style={{ position: 'absolute', bottom: 0, left: 0 }}>
        <ShimmerSkeletonGroup
          width={metadata.width}
          height={metadata.height}
          shapes={shapes}
        />
      </View>
    </View>
  );
}
