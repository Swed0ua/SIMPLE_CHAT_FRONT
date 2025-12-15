module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'no-var': 'error',
    'prefer-const': 'warn',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
};
