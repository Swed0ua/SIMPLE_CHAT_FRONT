import { ChatType } from '../../types/chat';

export type ChatBubbleVariant = {
  showSenderName: boolean;
  showAvatar: boolean;
  useMessageGrouping: boolean;
};

export const CHAT_BUBBLE_VARIANT: Record<ChatType, ChatBubbleVariant> = {
  [ChatType.DIRECT]: {
    showSenderName: false,
    showAvatar: false,
    useMessageGrouping: true,
  },
  [ChatType.GROUP]: {
    showSenderName: true,
    showAvatar: true,
    useMessageGrouping: true,
  },
};

export const CHAT_BUBBLE_AVATAR_SIZE = 38;
