export const Colors = {
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3',
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },

  // Background
  background: {
    primary: '#F5F7FA',
    secondary: '#FFFFFF',
    tertiary: '#F0F2F5',
  },

  // Text
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
    disabled: '#D1D5DB',
  },

  // Border
  border: {
    light: '#E5E7EB',
    default: '#D1D5DB',
    dark: '#9CA3AF',
  },

  // Semantic colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Chat specific
  chat: {
    messageSent: '#2196F3',
    messageReceived: '#F3F4F6',
    bubbleSent: '#2196F3',
    bubbleReceived: '#E5E7EB',
  },
} as const;

export type ColorsKeys = keyof typeof Colors;
