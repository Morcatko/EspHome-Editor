module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['plugin:@typescript-eslint/recommended'],
  rules: {
    'no-console': 'error',
    '@typescript-eslint/no-explicit-any': 1,
  },
};
