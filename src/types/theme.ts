import { Colors } from '../constants/colors';
import { BorderRadius, Spacing } from '../constants/spacing';
import { Typography } from '../constants/typography';

export type ThemeMode = 'light' | 'dark';
export type ThemeModeSettings = ThemeMode | 'auto';

export interface Theme {
  mode: ThemeMode;
  colors: typeof Colors;
  spacing: typeof Spacing;
  borderRadius: typeof BorderRadius;
  typography: typeof Typography;
}
