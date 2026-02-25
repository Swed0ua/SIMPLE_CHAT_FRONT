import React from 'react';
import {
  ShimmerSkeleton,
  ShimmerSkeletonCircle,
  ShimmerSkeletonRounded,
} from '../ShimmerSkeleton/ShimmerSkeleton';
import { View } from 'react-native';

export default function ChatDetailsSkeleton() {
  return (
    <View>
      <ShimmerSkeleton style={{ width: 200, height: 200 }} />
      <ShimmerSkeletonRounded />
      <ShimmerSkeletonCircle />
    </View>
  );
}
