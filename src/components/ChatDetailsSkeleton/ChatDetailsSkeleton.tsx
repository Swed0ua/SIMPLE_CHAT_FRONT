import React, { useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';
import ShimmerSkeletonGroup from '../ShimmerSkeleton/ShimmerSkeletonGroup';
import { ChatDetailsSkeletonProps } from './ChatDetailsSkeleton.types';
import { LAYOUT_BUILDERS } from './ChatDetailsSkeleton.layouts';

const DEFAULT_VARIANT = 'multiple' as const;

export default function ChatDetailsSkeleton({
  variant = DEFAULT_VARIANT,
}: ChatDetailsSkeletonProps) {
  const { width, height } = useWindowDimensions();

  const { shapes, metadata } = useMemo(
    () => LAYOUT_BUILDERS[variant]({ width, height }),
    [width, height, variant],
  );

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
