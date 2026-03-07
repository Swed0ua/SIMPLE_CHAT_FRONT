import React from 'react';
import { Text, View, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getStyles } from './Badge.styles';

export type BadgeProps = {
  value: number | string;
  backgroundColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function Badge({
  value,
  backgroundColor,
  style,
  textStyle,
}: BadgeProps) {
  const { theme } = useTheme();
  const styles = getStyles(theme, backgroundColor);

  return (
    <View style={[styles.badge, style]}>
      <Text style={[styles.badgeText, textStyle]}>{String(value)}</Text>
    </View>
  );
}
