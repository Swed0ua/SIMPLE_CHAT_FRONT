import { Insets, StyleSheet } from 'react-native';
import { Theme } from '../../../types/theme';

export const getStyles = ({
  theme,
  insets,
  keyboardHeight,
}: {
  theme: Theme;
  insets: Insets;
  keyboardHeight: number;
}) => {
  const { spacing } = theme;
  // NOTE: Difference between keyboard height and 30px is the difference between the show of the screen and the hide of the keyboard.
  const differenceKeyboardHeight = Math.max(0, keyboardHeight - 30);
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
    scrollToBottomButton: {
      position: 'absolute',
      bottom: spacing.md + 100 + differenceKeyboardHeight,
      right: spacing.sm + (insets.right ?? 0),
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary[500],
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollToBottomButtonText: {
      color: theme.colors.text.inverse,
      fontSize: theme.typography.fontSize.lg,
    },
  });
};
