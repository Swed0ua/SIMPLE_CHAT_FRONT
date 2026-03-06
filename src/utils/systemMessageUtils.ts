import { format } from 'date-fns';
import type { Message, SystemMessageData } from '../store/slices/messagesSlice';
import { getDayKey } from './timeFormating';

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

// Date divider message

function createDayDivider(dateKey: string, insertIndex: number): Message {
  const [y, m, d] = dateKey.split('-').map(Number);
  const createdAt = new Date(y, m - 1, d).toISOString();
  return {
    id: `day-${dateKey}-${insertIndex}`,
    chatId: '',
    senderId: '',
    text: '',
    createdAt,
    isSystemMessage: true,
    systemMessageData: { type: 'DayDivider', dateKey },
  };
}

export function buildDisplayList(
  messages: Message[],
  dayDividerIndices: number[],
): Message[] {
  const indexSet = new Set(dayDividerIndices);
  const result: Message[] = [];
  let displayIdx = 0;
  let msgIdx = 0;
  while (msgIdx < messages.length) {
    if (indexSet.has(displayIdx)) {
      const dateKey = getDayKey(messages[msgIdx - 1].createdAt);
      result.push(createDayDivider(dateKey, displayIdx));
      displayIdx += 1;
    }
    result.push(messages[msgIdx]);
    msgIdx += 1;
    displayIdx += 1;
  }
  return result;
}
