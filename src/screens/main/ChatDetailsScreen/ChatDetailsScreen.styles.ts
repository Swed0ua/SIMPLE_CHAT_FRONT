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
      paddingLeft: spacing.sm + (insets.left ?? 0),
      paddingRight: spacing.sm + (insets.right ?? 0),
    },
    listBottomContainer: {
      paddingBottom: spacing.lg,
    },
  });
};
