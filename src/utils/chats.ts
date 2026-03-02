import { IsInMessagesGroupInterface } from '../screens/main/ChatDetailsScreen/ChatDetailsScreen.types';
import { Message } from '../store/slices/messagesSlice';

export const getIsInMessagesGroup = (
  messages: Message[],
  index: number,
): IsInMessagesGroupInterface => {
  const inMessagesGroup: IsInMessagesGroupInterface = {
    isFirst: true,
    isLast: true,
  };
  const list = messages ?? [];
  const current = list[index];
  if (!current) return inMessagesGroup;

  if (
    index < list.length - 1 &&
    current.senderId === list[index + 1]?.senderId
  ) {
    inMessagesGroup.isFirst = false;
  }
  if (index > 0 && current.senderId === list[index - 1]?.senderId) {
    inMessagesGroup.isLast = false;
  }
  return inMessagesGroup;
};
