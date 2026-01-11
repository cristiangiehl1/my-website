/** @typedef {import('prettier').Config} PrettierConfig */

/** @type { PrettierConfig } */

const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  quoteProps: 'as-needed',
  jsxSingleQuote: true,
  bracketSameLine: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'auto',
  bracketSameLine: false,
  arrowParens: 'always',
  proseWrap: 'preserve', // 'always', 'never'
}

export default config
