import { View, ViewProps } from 'react-native';

type KeyboardSpacerProps = {
  height: number;
  bottomInset?: number;
} & ViewProps;

export function KeyboardSpacer({
  height,
  bottomInset = 0,
  style,
  ...rest
}: KeyboardSpacerProps) {
  const effectiveHeight = Math.max(0, height - bottomInset);
  return <View style={[{ height: effectiveHeight }, style]} {...rest} />;
}
