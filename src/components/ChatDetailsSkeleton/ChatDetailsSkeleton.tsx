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
    const items: ShimmerItemInput[] = Array.from(
      { length: count },
      (_, index) => ({
        // Check item position and render as own message else default as guest message
        ...(index % 3 === 0
          ? { x: width * 0.3 - MESSAGES_CONFIG.skeleton.MESSAGE_PADDING }
          : {}),
        type: 'round' as const,
        width: messageWidth,
        height: MESSAGES_CONFIG.skeleton.MESSAGE_HEIGHT,
      }),
    );
    return createShimmerLayout({
      items,
      gap: MESSAGES_CONFIG.skeleton.MESSAGE_GAP,
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
