import { ShimmerLayoutResult } from '../ShimmerSkeleton/ShimmerLayoutFactoryNew';

export type ChatDetailsSkeletonVariant = 'multiple' | 'single';

export type LayoutBuilderParams = {
  width: number;
  height: number;
};

export type ChatDetailsLayoutBuilder = (
  params: LayoutBuilderParams,
) => ShimmerLayoutResult;

export type ChatDetailsSkeletonProps = {
  variant?: ChatDetailsSkeletonVariant;
};
