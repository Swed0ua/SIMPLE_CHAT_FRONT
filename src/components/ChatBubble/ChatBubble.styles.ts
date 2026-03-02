import { StyleSheet } from 'react-native';
import { Theme } from '../../types/theme';
import { IsInMessagesGroupInterface } from '../../screens/main/ChatDetailsScreen/ChatDetailsScreen.types';

const getStyles = ({
  theme,
  isInMessagesGroup,
  avatarSize,
}: {
  theme: Theme;
  isInMessagesGroup: IsInMessagesGroupInterface;
  avatarSize: number;
}) => {
  const { colors, spacing, borderRadius, typography } = theme;
  const { isFirst, isLast } = isInMessagesGroup;
  const messageGap = spacing.sm;
  return StyleSheet.create({
    wrapper: { maxWidth: '80%', marginVertical: spacing.xs },
    wrapperOwn: { alignSelf: 'flex-end' },
    wrapperOther: { alignSelf: 'flex-start' },
    wrapperRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: messageGap,
    },
    avatarCircle: {
      width: avatarSize,
      height: avatarSize,
      borderRadius: avatarSize,
      backgroundColor: '#3b82f6',
    },
    senderName: {
      fontSize: typography.fontSize.xs,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },

    bubbleOffset: { marginLeft: avatarSize + messageGap },
    bubble: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.xl,
    },
    bubbleOwn: {
      backgroundColor: colors.chat.bubbleSent,
      ...(isLast ? { borderBottomRightRadius: 0 } : {}),
    },
    bubbleOther: {
      backgroundColor: colors.chat.bubbleReceived,
      ...(isLast ? { borderBottomLeftRadius: 0 } : {}),
    },

    text: {
      fontSize: typography.fontSize.base,
      lineHeight: typography.fontSize.base * typography.lineHeight.normal,
      fontWeight: typography.fontWeight.normal,
    },
    textOwn: { color: colors.text.inverse },
    textOther: { color: colors.text.primary },

    time: {
      marginTop: spacing.xs,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.normal,
    },
    timeOwn: { color: colors.text.inverse, opacity: 0.85 },
    timeOther: { color: colors.text.secondary },
  });
};

export default getStyles;
