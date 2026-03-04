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

export const MOCK_MESSAGES: MockMessageItem[] = Array.from(
  { length: 100 },
  (_, i) => {
    const index = i + 1;
    const isSystemMessage = index % 7 === 0;
    return {
      id: `m${index}`,
      senderId: index % 3 === 0 ? 'u1' : 'u2',
      isSystemMessage: isSystemMessage ? true : false,
      text: isSystemMessage ? 'System message ' : TEXTS[index % TEXTS.length],
      createdAt: new Date(now - (100 - index) * HOUR).toISOString(),
      systemMessageData: isSystemMessage
        ? {
            type: 'AddedMember',
            memberId: 'u10',
            memberName: 'User 111',
            addedByUserId: 'u11',
          }
        : undefined,
    };
  },
).reverse();
