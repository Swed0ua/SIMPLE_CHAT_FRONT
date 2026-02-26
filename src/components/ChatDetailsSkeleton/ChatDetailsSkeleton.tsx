import React from 'react';
import { View } from 'react-native';
import ShimmerSkeletonGroup from '../ShimmerSkeleton/ShimmerSkeletonGroup';
import { createShimmerLayout } from '../ShimmerSkeleton/ShimmerLayoutFactory';

const { shapes, metadata } = createShimmerLayout({
  gap: 12,
  padding: 16,
  items: [
    { type: 'round', width: 280, height: 80 },
    { type: 'rect', width: 120, height: 16 },
    { type: 'rect', width: 200, height: 16 },
    { type: 'circle', r: 28 },
  ],
});

export default function ChatDetailsSkeleton() {
  return (
    <View>
      {/* <ShimmerSkeleton style={{ width: 200, height: 200 }} />
      <ShimmerSkeletonRounded />
      <ShimmerSkeletonCircle /> */}
      <ShimmerSkeletonGroup
        width={metadata.width}
        height={metadata.height}
        shapes={shapes}
      />
    </View>
  );
}
