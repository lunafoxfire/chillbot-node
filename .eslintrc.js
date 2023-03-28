const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  root: true,
  plugins: [],
  extends: [
    "standard-with-typescript",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    project: "./tsconfig.eslint.json",
  },
  rules: {
    // handled by typescript
    "semi": OFF,
    "comma-dangle": OFF,
    "space-before-function-paren": OFF,
    "quotes": OFF,
    "no-return-await": OFF,
    
    "multiline-ternary": [ERROR, "always-multiline"],
    "no-multiple-empty-lines": [ERROR, { "max": 2, "maxEOF": 1, "maxBOF": 0 }],
    "operator-linebreak": [ERROR, "before"],
    "quote-props": [ERROR, "consistent"],
    
    "@typescript-eslint/semi": [ERROR, "always"],
    "@typescript-eslint/comma-dangle": [ERROR, "always-multiline"],
    "@typescript-eslint/quotes": [ERROR, "double"],
    "@typescript-eslint/space-before-function-paren": [ERROR, {
      anonymous: "never",
      named: "never",
      asyncArrow: "always"
    }],
    "@typescript-eslint/consistent-type-definitions": [ERROR, "type"],
    "@typescript-eslint/member-delimiter-style": [ERROR, {
      multiline: { delimiter: "comma", requireLast: true },
      singleline: { delimiter: "comma", requireLast: false },
    }],
    "@typescript-eslint/restrict-plus-operands": [ERROR, { allowAny: true }],
    "@typescript-eslint/prefer-nullish-coalescing": [ERROR, { ignoreTernaryTests: false }],
    
    "@typescript-eslint/naming-convention": OFF,
    "@typescript-eslint/explicit-function-return-type": OFF,
    "@typescript-eslint/strict-boolean-expressions": OFF,
    "@typescript-eslint/no-non-null-assertion": OFF,
    "@typescript-eslint/dot-notation": OFF,
    "@typescript-eslint/no-extraneous-class": OFF,
    "@typescript-eslint/return-await": OFF,
    "@typescript-eslint/array-type": OFF,
    "@typescript-eslint/consistent-indexed-object-style": OFF,
    "@typescript-eslint/restrict-template-expressions": [OFF],
  },
};
