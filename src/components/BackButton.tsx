import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import { IconChevronLeft } from '@tabler/icons-react-native';
import { useTheme } from '../context/ThemeContext';
import { mainConfig } from '../config/main';

export type BackButtonProps = {
  onPress: () => void;
  style?: ViewStyle;
  iconColor?: string;
  iconSize?: number;
  hitSlop?:
    | number
    | { top?: number; bottom?: number; left?: number; right?: number };
};

const DEFAULT_HIT_SLOP = mainConfig.BACK_BUTTON_DEFAULT_HIT_SLOP;

export function BackButton({
  onPress,
  style,
  iconColor,
  iconSize = 24,
  hitSlop = DEFAULT_HIT_SLOP,
}: BackButtonProps) {
  const { theme } = useTheme();
  const color = iconColor ?? theme.colors.text.primary;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={typeof hitSlop === 'number' ? hitSlop : DEFAULT_HIT_SLOP}
      style={({ pressed }) => [
        { padding: theme.spacing.xs, marginLeft: -theme.spacing.xs },
        pressed && { opacity: 0.7 },
        style,
      ]}
    >
      <IconChevronLeft size={iconSize} color={color} strokeWidth={3} />
    </Pressable>
  );
}

export default BackButton;
