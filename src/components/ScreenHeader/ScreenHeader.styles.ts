import { Insets, StyleSheet } from 'react-native';
import { Theme } from '../../types/theme';

export const getStyles = ({
  theme,
  insets,
}: {
  theme: Theme;
  insets: Insets;
}) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: insets.top,
      paddingBottom: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      gap: theme.spacing.sm,
      backgroundColor: theme.colors.background.secondary,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border.default,
    },
    backButton: {
      padding: theme.spacing.xs,
      marginLeft: -theme.spacing.xs,
    },
    center: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      minWidth: 0,
    },
    titleBlock: {
      flex: 1,
      minWidth: 0,
      justifyContent: 'center',
    },
    title: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text.primary,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.secondary,
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
  });
};
