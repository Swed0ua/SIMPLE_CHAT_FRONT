import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

export interface ShimmerSkeletonProps extends ViewProps {
  style?: StyleProp<ViewStyle>[] | ViewStyle | undefined;
  children?: React.ReactNode;
  baseColor?: string;
  shimmerColor?: string;
  shimmerWidth?: number;
  duration?: number;
}

function ShimmerSkeletonBase({
  style,
  children,
  baseColor,
  shimmerColor = 'rgba(255, 255, 255, 0.5)',
  shimmerWidth = 120,
  duration = 2200,
}: ShimmerSkeletonProps) {
  const themeStyle = useTheme();
  const { theme } = themeStyle;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const backgroundColor = baseColor ?? theme.colors.border.light ?? '#E5E7EB';

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration,
        useNativeDriver: false,
      }),
    );
    animation.start();

    return () => animation.stop();
  }, [duration, shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 320],
  });

  return (
    <View style={[styles.base, { backgroundColor: backgroundColor }, style]}>
      {children}
      <Animated.View
        style={[styles.shimmer, { transform: [{ translateX }] }]}
        pointerEvents="none"
      >
        <Svg height="100%" width={shimmerWidth} style={styles.shimmerSvg}>
          <Defs>
            <LinearGradient
              id="shimmerGradient"
              x1="0%"
              y1="0"
              x2="100%"
              y2="0"
            >
              <Stop
                offset="0%"
                stopColor="rgba(255, 255, 255, 0)"
                stopOpacity={0}
              />
              <Stop offset="20%" stopColor={shimmerColor} stopOpacity={0.5} />
              <Stop offset="80%" stopColor={shimmerColor} stopOpacity={0.5} />
              <Stop
                offset="100%"
                stopColor="rgba(255, 255, 255, 0)"
                stopOpacity={0}
              />
            </LinearGradient>
          </Defs>
          <Rect
            x={0}
            y={0}
            width={shimmerWidth}
            height="100%"
            fill="url(#shimmerGradient)"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

function ShimmerSkeleton(props: ShimmerSkeletonProps) {
  return <ShimmerSkeletonBase {...props} />;
}

interface ShimmerSkeletonCircleProps extends Omit<
  ShimmerSkeletonProps,
  'style'
> {
  size?: number;
  style?: StyleProp<ViewStyle>[] | ViewStyle | undefined;
}
function ShimmerSkeletonCircle({
  size,
  style,
  ...props
}: ShimmerSkeletonCircleProps) {
  const circleSize = size ?? 120;
  return (
    <ShimmerSkeletonBase
      style={[
        { width: circleSize, height: circleSize, borderRadius: circleSize / 2 },
        style,
      ]}
      {...props}
    />
  );
}

export interface ShimmerSkeletonRoundedProps extends ShimmerSkeletonProps {
  borderRadius?: number;
  width?: number;
  height?: number;
}

function ShimmerSkeletonRounded({
  borderRadius,
  width,
  height,
  style,
  ...props
}: ShimmerSkeletonRoundedProps) {
  const themeStyle = useTheme();
  const { theme } = themeStyle;
  const roundedBorderRadius = borderRadius ?? theme.borderRadius?.xl;
  const roundedWidth = width ?? theme.borderRadius?.xl * 10;
  const roundedHeight = height ?? theme.borderRadius?.xl * 10;

  return (
    <ShimmerSkeletonBase
      style={[
        style,
        {
          width: roundedWidth,
          height: roundedHeight,
          borderRadius: roundedBorderRadius,
        },
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden' },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 120,
  },
  shimmerSvg: {
    flex: 1,
    width: 120,
  },
});
export { ShimmerSkeleton, ShimmerSkeletonCircle, ShimmerSkeletonRounded };
