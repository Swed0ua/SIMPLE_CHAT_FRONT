import { Insets, StyleSheet } from 'react-native';
import { Theme } from '../../types/theme';

export const getStyles = ({
  theme,
  insets,
}: {
  theme: Theme;
  insets: Insets;
}) => {
  const { spacing, borderRadius } = theme;
  const paddingBottom = Math.max(insets.bottom ?? 0, spacing.sm);

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      paddingBottom,
      backgroundColor: theme.colors.background.secondary,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border.default,
    },
    input: {
      flex: 1,
      minHeight: 40,
      maxHeight: 120,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.lg,
      backgroundColor: theme.colors.background.tertiary,
      borderWidth: 1,
      borderColor: theme.colors.border.default,
      fontSize: 16,
      color: theme.colors.text.primary,
    },
    submitButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      minHeight: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: borderRadius.lg,
      backgroundColor: theme.colors.primary[500],
    },
    submitButtonDisabled: {
      backgroundColor: theme.colors.primary[200],
      opacity: 0.8,
    },
    submitLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.inverse,
    },
    submitLabelDisabled: {
      color: theme.colors.text.inverse,
      opacity: 0.9,
    },
  });
};
