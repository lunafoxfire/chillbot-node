/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/no-unused-vars */
const OFF = 0;
const WARN = 1;
const ERROR = 2;
/* eslint-enable @typescript-eslint/no-unused-vars */

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'plugin:node/recommended',
    'airbnb-typescript/base',
  ],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    'linebreak-style': OFF,
    'class-methods-use-this': OFF,
    'import/prefer-default-export': OFF,
    'no-multiple-empty-lines': [ERROR, { max: 2 }],
    '@typescript-eslint/lines-between-class-members': OFF,
    'max-classes-per-file': OFF,
    'no-restricted-syntax': [ERROR,
      {
        'selector': 'ForInStatement',
        'message': 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        'selector': 'LabeledStatement',
        'message': 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        'selector': 'WithStatement',
        'message': '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    'max-len': [WARN,
      {
        'code': 140,
        'tabWidth': 2,
        'ignoreUrls': true,
        'ignoreStrings': true,
        'ignoreTemplateLiterals': true,
        'ignoreRegExpLiterals': true,
      },
    ],
    'object-curly-newline': OFF,
    'no-plusplus': OFF,
    'no-undef-init': OFF,

    // Typescript handles these
    'no-undef': OFF,
    'node/no-missing-import': OFF,
    'node/no-unsupported-features/es-syntax': OFF,
  },
};
