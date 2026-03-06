import { Text } from 'react-native';
import { Message } from '../../store/slices/messagesSlice';
import { ChatType } from '../../types/chat';
import { getIsInMessagesGroup } from '../../utils/chats';
import ChatBubble from '../ChatBubble/ChatBubble';
import { CHAT_BUBBLE_VARIANT } from '../ChatBubble/chatBubbleConfig';

type ChatMessageRowProps = {
  message: Message;
  index: number;
  messages: Message[];
  chatType: ChatType;
  currentUserId: string | undefined;
};

export function ChatMessageRow({
  message,
  index,
  messages,
  chatType,
  currentUserId,
}: ChatMessageRowProps) {
  const variant = CHAT_BUBBLE_VARIANT[chatType];
  const isInMessagesGroup = variant.useMessageGrouping
    ? getIsInMessagesGroup(messages, index)
    : { isFirst: true, isLast: true };

  return (
    <>
      <Text>Message index: {index.toString()}</Text>
      <Text>
        Message createdAt: {new Date(message.createdAt).toLocaleString()}
      </Text>
      <ChatBubble
        message={message}
        chatType={chatType}
        currentUserId={currentUserId}
        isInMessagesGroup={isInMessagesGroup}
      />
    </>
  );
}
