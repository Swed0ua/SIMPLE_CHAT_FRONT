import { Insets, StyleSheet } from 'react-native';
import { Theme } from '../../../types/theme';

export const getStyles = ({
  theme,
  insets,
}: {
  theme: Theme;
  insets: Insets;
}) => {
  const { spacing } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    listContainer: {
      paddingHorizontal: spacing.sm,
    },
    listBottomContainer: {
      paddingBottom: (insets.bottom ?? 0) + spacing.lg,
    },
  });
};
