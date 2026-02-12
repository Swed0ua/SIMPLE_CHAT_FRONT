import { useCallback, useMemo } from 'react';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getStyle } from './ChatItemStyle';
import { Chat } from '../../store/slices/chatSlice';
import { useTheme } from '../../context/ThemeContext';
import { truncateForDisplay } from '../../utils/textFormating';
import { formatChatTime } from '../../utils/timeFormating';

type ChatItemProps = {
  chatItem: Chat;
  onPress: (chatId: string) => void;
};

function ChatItem({ chatItem, onPress }: ChatItemProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => getStyle({ theme: theme.theme }), [theme.theme]);
  const userSymbol = chatItem.title.charAt(0).toUpperCase();
  const renderChatItemAvatar = useCallback(() => {
    return (
      <View style={styles.chatItemAvatar}>
        <Text>{userSymbol}</Text>
      </View>
    );
  }, [chatItem.title]);

  const truncatedLastMessage = truncateForDisplay(
    chatItem?.lastMessage ?? t('chatItem.noMessages'),
    40,
  );
  const lastActiveTimeISO = chatItem?.lastMessageAt ?? chatItem?.createdAt;
  const lastActiveTimeFormatted = formatChatTime(lastActiveTimeISO, t);
  const truncatedTitle = truncateForDisplay(chatItem.title ?? '', 24);

  const handlePress = useCallback(() => {
    onPress(chatItem.id);
  }, [chatItem.id, onPress]);

  return (
    <Pressable
      accessibilityLabel={`Chat item ${chatItem.title}`}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.chatItem,
        pressed && styles.chatItemPressed,
      ]}
      // android_ripple={{ color: 'rgba(0,0,0,0.1)' }} // TODO: add ripple effect for test in android
      onPress={handlePress}
    >
      <View>{renderChatItemAvatar()}</View>
      <View style={styles.contentWrapper}>
        <View style={styles.headerWrapper}>
          <View style={styles.headerTitleWrapper}>
            <Text style={styles.headerTitleText}>{truncatedTitle}</Text>
          </View>
          <View style={styles.headerTimeWrapper}>
            <Text style={styles.headerTimeText}>{lastActiveTimeFormatted}</Text>
          </View>
        </View>
        <View style={styles.contentTextWrapper}>
          <View style={styles.contentTextMessageWrapper}>
            <Text style={styles.contentTextMessageText}>
              {truncatedLastMessage}
            </Text>
          </View>
          <View style={styles.contentTextRightContentWrapper}>
            <View style={styles.contentTextMessageIndicator}>
              <Text style={styles.contentTextMessageIndicatorText}>19</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default React.memo(ChatItem);
