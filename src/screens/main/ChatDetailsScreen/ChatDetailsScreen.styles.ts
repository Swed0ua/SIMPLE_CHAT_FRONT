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
    scrollToBottomContainer: {
      position: 'absolute',
      bottom: spacing.md + 100 + differenceKeyboardHeight,
      right: spacing.sm + (insets.right ?? 0),
      zIndex: 1000,
    },
    scrollToBottomButton: {
      width: 50,
      height: 50,
      borderRadius: 50,
      backgroundColor: theme.colors.primary[800],
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    scrollToBottomButtonText: {
      color: theme.colors.text.inverse,
      fontSize: theme.typography.fontSize.lg,
    },
  });
};
