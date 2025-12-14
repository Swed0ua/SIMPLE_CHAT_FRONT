import { Theme, ThemeMode } from '../types/theme';
import { Colors } from './colors';
import { BorderRadius, Spacing } from './spacing';
import { Typography } from './typography';

export const lightTheme: Theme = {
  mode: 'light' as ThemeMode,
  colors: Colors,
  spacing: Spacing,
  borderRadius: BorderRadius,
  typography: Typography,
};

export const availableThemes: { [key in ThemeMode]: Theme } = {
  light: lightTheme,
  dark: lightTheme,
};
