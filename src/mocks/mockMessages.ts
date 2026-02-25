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
  'Same here, thanks',
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
    return {
      id: `m${index}`,
      senderId: index % 2 === 1 ? 'u1' : 'u2',
      text: TEXTS[index % TEXTS.length],
      createdAt: new Date(now - (100 - index) * HOUR).toISOString(),
    };
  },
);
