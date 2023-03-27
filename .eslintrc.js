/* eslint-disable no-unused-vars */
const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  root: true,
  plugins: [],
  extends: [
    'standard-with-typescript',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    // sourceType: 'module',
    project: './tsconfig.eslint.json',
  },
  rules: {
    'semi': [ERROR, 'always'],
    'comma-dangle': OFF,
    'quote-props': OFF,
    'no-multiple-empty-lines': OFF,
    'no-empty-pattern': OFF,
    'operator-linebreak': [ERROR, 'before'],
    'multiline-ternary': OFF,

    '@typescript-eslint/semi': [ERROR, 'always'],
    '@typescript-eslint/comma-dangle': [ERROR, 'always-multiline'],
    '@typescript-eslint/naming-convention': OFF,
    '@typescript-eslint/space-before-function-paren': OFF,
    '@typescript-eslint/explicit-function-return-type': OFF,
    '@typescript-eslint/consistent-type-definitions': [ERROR, 'type'],
    '@typescript-eslint/member-delimiter-style': [ERROR, {
      multiline: { delimiter: 'comma', requireLast: true },
      singleline: { delimiter: 'comma', requireLast: false },
    }],
    '@typescript-eslint/no-empty-interface': OFF,
    '@typescript-eslint/strict-boolean-expressions': OFF,
    '@typescript-eslint/prefer-nullish-coalescing': OFF,
    '@typescript-eslint/restrict-template-expressions': OFF,
    '@typescript-eslint/no-non-null-assertion': OFF,
    '@typescript-eslint/dot-notation': OFF,
    '@typescript-eslint/no-extraneous-class': OFF,
    '@typescript-eslint/return-await': OFF,
    '@typescript-eslint/array-type': OFF,
    '@typescript-eslint/restrict-plus-operands': [ERROR, { allowAny: true }],
  },
};
