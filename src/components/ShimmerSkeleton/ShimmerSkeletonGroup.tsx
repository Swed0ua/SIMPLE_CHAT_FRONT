import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Mask,
  Rect,
  Stop,
} from 'react-native-svg';
import { mainConfig } from '../../config/main';
import { useTheme } from '../../context/ThemeContext';
import { useEffect, useRef } from 'react';
import { ShimmerShape } from './ShimmerSkeleton.types';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export interface ShimmerSkeletonGroupProps {
  width: number;
  height: number;
  shapes: ShimmerShape[];
  baseColor?: string;
  shimmerColor?: string;
  shimmerBandWidth?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

function ShimmerSkeletonGroup({
  width,
  height,
  shapes,
  baseColor,
  shimmerColor = 'rgba(255, 255, 255, 0.5)',
  shimmerBandWidth = mainConfig.SHIMMER_BAND_WIDTH,
  duration = 2200,
  style,
  ...rest
}: ShimmerSkeletonGroupProps) {
  const { theme } = useTheme();
  const backgroundColor = baseColor ?? theme.colors.border?.light ?? '#E5E7EB';
  const shimmerAnim = useRef(new Animated.Value(0)).current;

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
    outputRange: [-shimmerBandWidth, width + shimmerBandWidth],
  });

  return (
    <View style={[styles.groupBase, { width, height }, style]} {...rest}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient
            id="shimmerGroupGradient"
            x1="0%"
            y1="0"
            x2="100%"
            y2="0"
          >
            <Stop offset="0%" stopColor={backgroundColor} stopOpacity={0} />
            <Stop offset="20%" stopColor={shimmerColor} />
            <Stop offset="80%" stopColor={shimmerColor} />
            <Stop offset="100%" stopColor={backgroundColor} stopOpacity={0} />
          </LinearGradient>
          <Mask id="shapesMask">
            {shapes.map((shape, i) =>
              shape.type === 'rect' ? (
                <Rect
                  key={i}
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  rx={shape.borderRadius ?? 0}
                  ry={shape.borderRadius ?? 0}
                  fill="white"
                />
              ) : (
                <Circle
                  key={i}
                  cx={shape.cx}
                  cy={shape.cy}
                  r={shape.r}
                  fill="white"
                />
              ),
            )}
          </Mask>
        </Defs>
        {shapes.map((shape, i) =>
          shape.type === 'rect' ? (
            <Rect
              key={`bg-${i}`}
              x={shape.x}
              y={shape.y}
              width={shape.width}
              height={shape.height}
              rx={shape.borderRadius ?? 0}
              ry={shape.borderRadius ?? 0}
              fill={backgroundColor}
            />
          ) : (
            <Circle
              key={`bg-${i}`}
              cx={shape.cx}
              cy={shape.cy}
              r={shape.r}
              fill={backgroundColor}
            />
          ),
        )}
        <AnimatedRect
          x={translateX}
          y={0}
          width={shimmerBandWidth}
          height={height}
          fill="url(#shimmerGroupGradient)"
          mask="url(#shapesMask)"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  groupBase: {
    overflow: 'hidden',
  },
});

export default ShimmerSkeletonGroup;
