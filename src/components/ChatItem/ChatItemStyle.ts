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
    },
    contentTextMessageText: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text.primary,
      opacity: 0.5,
    },
    contentTextRightContentWrapper: {},
    contentTextMessageIndicator: {
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.info,
      paddingHorizontal: theme.spacing.xs,
      minWidth: theme.spacing.md,
      height: theme.spacing.md,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'flex-start',
    },
    contentTextMessageIndicatorText: {
      color: theme.colors.text.inverse,
      fontSize: theme.typography.fontSize.xxs,
      fontWeight: theme.typography.fontWeight.medium,
    },
  });
};
