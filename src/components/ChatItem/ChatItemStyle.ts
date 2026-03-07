import { StyleSheet } from 'react-native';
import { Theme } from '../../types/theme';

export const getStyle = ({ theme }: { theme: Theme }) => {
  return StyleSheet.create({
    chatItem: {
      padding: theme.spacing.md,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    chatItemPressed: {
      backgroundColor: theme.colors.primary[100],
    },
    chatItemAvatar: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary[500],
    },
    contentWrapper: {
      flex: 1,
      gap: 2,
    },
    headerWrapper: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    headerTitleWrapper: {
      flex: 1,
    },
    headerTimeWrapper: {},
    headerTitleText: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    headerTimeText: {
      fontSize: theme.typography.fontSize.xxs,
      fontWeight: theme.typography.fontWeight.medium,
      opacity: 0.5,
    },
    contentTextWrapper: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      height: theme.spacing.md,
    },
    contentTextMessageWrapper: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    contentTextMessageText: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text.primary,
      opacity: 0.5,
    },
    contentTextMessageTextDraft: {
      color: theme.colors.error,
      opacity: 0.7,
    },
    contentTextRightContentWrapper: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
  });
};
