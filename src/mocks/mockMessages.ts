import { ChatType } from '../types/chat';

export type MockMessageItem = {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
};

const now = new Date().getTime();
const HOUR = 3600000;

const TEXTS = [
  'Hey',
  'Hi there',
  'How are you?',
  'Good, you?',
  'Same here, thanks, i dont look like a cat, i look like a dog',
  "What's up?",
  'Not much',
  'Cool',
  'Ok',
  'Sure',
  'Sounds good',
  'Let me know',
  'See you later',
  'Bye',
  'Thanks',
  'No problem',
  'Got it',
  'Right',
  'Yeah',
  'Nah',
  'Maybe',
  'Later',
  'Call me',
  'Send it',
  'Done',
  'Working on it',
  'Almost there',
  'Check this',
  'Look',
  'Wait',
];

export const getMockMessages = (
  type: ChatType = ChatType.DIRECT,
): MockMessageItem[] => {
  const length = 500;
  const date = new Date();
  return Array.from({ length }, (_, i) => {
    const index = i + 1;
    const isSystemMessage = index % 7 === 0;
    let senderId = index % 3 === 0 ? 'u1' : 'u2';
    if (type === ChatType.GROUP) {
      const a = [
        length - 12,
        // length - 4,
        // length - 7,
        // length - 8,
        // length - 11,
        // length - 12,
      ];
      senderId = a.includes(index) ? 'u2' : 'u1';
    }
    return {
      id: `m${index}-${date.toISOString()}`,
      senderId: senderId,
      isSystemMessage: isSystemMessage ? true : false,
      text: isSystemMessage ? 'System message ' : TEXTS[index % TEXTS.length],
      createdAt: new Date(now - (length - index) * HOUR).toISOString(),
      systemMessageData: isSystemMessage
        ? {
            type: 'AddedMember',
            memberId: 'u10',
            memberName: 'User 111',
            addedByUserId: 'u11',
          }
        : undefined,
    };
  }).reverse();
};

export const MOCK_MESSAGES: MockMessageItem[] = getMockMessages();
