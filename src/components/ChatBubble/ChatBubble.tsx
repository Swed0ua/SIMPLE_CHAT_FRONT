import { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Message } from '../../store/slices/messagesSlice';
import getStyles from './ChatBubble.styles';
import { formatTimeShort } from '../../utils/timeFormating';
import { Text, View } from 'react-native';
import { IsInMessagesGroupInterface } from '../../screens/main/ChatDetailsScreen/ChatDetailsScreen.types';
import { ChatType } from '../../types/chat';
import {
  CHAT_BUBBLE_AVATAR_SIZE,
  CHAT_BUBBLE_VARIANT,
} from './chatBubbleConfig';
import { Avatar } from '../Avatar';

export interface ChatBubbleProps {
  message: Message;
  currentUserId?: string | undefined;
  isInMessagesGroup: IsInMessagesGroupInterface;
  chatType: ChatType;
  avatarSize?: number;
}

function ChatBubble({
  chatType,
  message,
  currentUserId,
  isInMessagesGroup,
  avatarSize = CHAT_BUBBLE_AVATAR_SIZE,
}: ChatBubbleProps) {
  const styleTheme = useTheme();
  const { theme } = styleTheme;
  const styles = useMemo(
    () => getStyles({ theme, isInMessagesGroup, avatarSize }),
    [theme, isInMessagesGroup, avatarSize],
  );
  const isOwn = currentUserId ? message.senderId === currentUserId : false;
  const variant = CHAT_BUBBLE_VARIANT[chatType];

  const hasOffsetForAvatar = variant.showAvatar && !isOwn;
  const showAvatar = hasOffsetForAvatar && isInMessagesGroup.isLast;
  const showSenderName = hasOffsetForAvatar && isInMessagesGroup.isFirst;

  const bubbleStyle = [
    styles.bubble,
    isOwn ? styles.bubbleOwn : styles.bubbleOther,
    hasOffsetForAvatar && !showAvatar && styles.bubbleOffset,
  ];
  const textStyle = [styles.text, isOwn ? styles.textOwn : styles.textOther];
  const timeStyle = [styles.time, isOwn ? styles.timeOwn : styles.timeOther];

  function renderAvatar() {
    if (!showAvatar) return null;
    return <Avatar name={'Test'} size={avatarSize} />;
  }

  function renderTitle() {
    if (!showSenderName) return null;
    return <Text style={styles.senderName}>{message.senderId}</Text>;
  }

  function renderBubbleContent() {
    const timeLabel = formatTimeShort(message.createdAt);
    return (
      <>
        <Text style={textStyle}>{message.text}</Text>
        {timeLabel ? <Text style={timeStyle}>{timeLabel}</Text> : null}
      </>
    );
  }

  const wrapperStyle = [
    styles.wrapper,
    isOwn ? styles.wrapperOwn : styles.wrapperOther,
    hasOffsetForAvatar && styles.wrapperRow,
  ];

  return (
    <View style={wrapperStyle}>
      {renderAvatar()}
      <View style={bubbleStyle}>
        {renderTitle()}
        {renderBubbleContent()}
      </View>
    </View>
  );
}

export default ChatBubble;
