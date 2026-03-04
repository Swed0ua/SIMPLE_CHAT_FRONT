import type { Message, SystemMessageData } from '../store/slices/messagesSlice';

const DEFAULT_SYSTEM_MESSAGE_DATA: SystemMessageData = { type: 'Other' };

export function getNormalizedSystemMessage(message: Message): {
  text: string;
  systemMessageData: SystemMessageData;
  createdAt: string;
} {
  return {
    text: message.text,
    systemMessageData: message.systemMessageData ?? DEFAULT_SYSTEM_MESSAGE_DATA,
    createdAt: message.createdAt,
  };
}
