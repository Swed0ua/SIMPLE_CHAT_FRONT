import { StyleSheet } from 'react-native';
import { Theme } from '../../types/theme';

export const getStyles = (theme: Theme, backgroundColor?: string) =>
  StyleSheet.create({
    badge: {
      borderRadius: theme.borderRadius.full,
      backgroundColor: backgroundColor ?? theme.colors.info,
      paddingHorizontal: theme.spacing.xs,
      minWidth: theme.spacing.md,
      height: theme.spacing.md,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'flex-start',
    },
    badgeText: {
      color: theme.colors.text.inverse,
      fontSize: theme.typography.fontSize.xxs,
      fontWeight: theme.typography.fontWeight.medium,
    },
  });
