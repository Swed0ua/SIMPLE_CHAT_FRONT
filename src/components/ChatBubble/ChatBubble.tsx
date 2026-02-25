import { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Message } from '../../store/slices/messagesSlice';
import getStyles from './ChatBubble.styles';
import { formatTimeShort } from '../../utils/timeFormating';
import { Text, View } from 'react-native';
import { IsInMessagesGroupInterface } from '../../screens/main/ChatDetailsScreen/ChatDetailsScreen.types';

export interface ChatBubbleProps {
  message: Message;
  currentUserId?: string | undefined;
  isInMessagesGroup: IsInMessagesGroupInterface;
}

function ChatBubble({
  message,
  currentUserId,
  isInMessagesGroup,
}: ChatBubbleProps) {
  const styleTheme = useTheme();
  const { theme } = styleTheme;
  const styles = useMemo(
    () => getStyles({ theme, isInMessagesGroup }),
    [theme, isInMessagesGroup],
  );
  const isOwn = currentUserId ? message.senderId === currentUserId : false;

  const wrapperStyle = [
    styles.wrapper,
    isOwn ? styles.wrapperOwn : styles.wrapperOther,
  ];
  const bubbleStyle = [
    styles.bubble,
    isOwn ? styles.bubbleOwn : styles.bubbleOther,
  ];
  const textStyle = [styles.text, isOwn ? styles.textOwn : styles.textOther];
  const timeStyle = [styles.time, isOwn ? styles.timeOwn : styles.timeOther];

  const timeLabel = formatTimeShort(message.createdAt);
  return (
    <View style={wrapperStyle}>
      <View style={bubbleStyle}>
        <Text style={textStyle}>{message.text}</Text>
        {timeLabel ? <Text style={timeStyle}>{timeLabel}</Text> : null}
      </View>
    </View>
  );
}

export default ChatBubble;
