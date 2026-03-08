import { useCallback, useMemo } from 'react';
import React from 'react';
import { Pressable, Text, TextStyle, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getStyle } from './ChatItemStyle';
import { Chat } from '../../store/slices/chatSlice';
import { useTheme } from '../../context/ThemeContext';
import { truncateForDisplay } from '../../utils/textFormating';
import { formatChatTime } from '../../utils/timeFormating';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge/Badge';

type ChatItemProps = {
  chatItem: Chat;
  draft: string | undefined;
  onPress: (chatId: string) => void;
};

function ChatItem({ chatItem, onPress, draft }: ChatItemProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => getStyle({ theme: theme.theme }), [theme.theme]);
  const userSymbol = chatItem.title.charAt(0).toUpperCase();
  const renderChatItemAvatar = useCallback(() => {
    return <Avatar uri={chatItem.avatarUrl} name={userSymbol} />;
  }, [chatItem.avatarUrl, userSymbol]);

  const getLastMessage = useCallback(() => {
    if (draft) return draft;
    return chatItem?.lastMessage ?? t('chatItem.noMessages');
  }, [draft, chatItem?.lastMessage, t]);
  const truncatedLastMessage = truncateForDisplay(getLastMessage(), 40);

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
      onLongPress={() => {
        // TODO: add long press action
        console.log('long press');
      }}
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
            {draft && (
              <Text
                style={[
                  styles.contentTextMessageText,
                  styles.contentTextMessageTextDraft,
                  { opacity: 0.9 } as TextStyle,
                ]}
              >
                {t('chatItem.draft')}:
              </Text>
            )}
            <Text
              style={[
                styles.contentTextMessageText,
                draft && styles.contentTextMessageTextDraft,
              ]}
            >
              {truncatedLastMessage}
            </Text>
          </View>
          <View style={styles.contentTextRightContentWrapper}>
            {(chatItem.unreadCount ?? 0) > 0 && (
              <Badge value={chatItem.unreadCount ?? 0} />
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default React.memo(ChatItem);
