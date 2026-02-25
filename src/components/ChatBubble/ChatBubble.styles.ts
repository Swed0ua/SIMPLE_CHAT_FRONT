import { StyleSheet } from 'react-native';
import { Theme } from '../../types/theme';
import { IsInMessagesGroupInterface } from '../../screens/main/ChatDetailsScreen/ChatDetailsScreen.types';

const getStyles = ({
  theme,
  isInMessagesGroup,
}: {
  theme: Theme;
  isInMessagesGroup: IsInMessagesGroupInterface;
}) => {
  const { colors, spacing, borderRadius, typography } = theme;
  const { isFirst, isLast } = isInMessagesGroup;
  return StyleSheet.create({
    wrapper: { maxWidth: '80%', marginVertical: spacing.xs },
    wrapperOwn: { alignSelf: 'flex-end' },
    wrapperOther: { alignSelf: 'flex-start' },

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
