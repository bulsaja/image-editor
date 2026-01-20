module.exports = {
  // parser: 'babel',
  arrowParens: 'avoid', // Arrow function parameter parentheses, default: avoid, options: avoid | always
  bracketSpacing: true, // Print spaces in object literals, default: true
  insertPragma: false,
  printWidth: 120, // Line wrap length
  proseWrap: 'always',
  requirePragma: false,
  singleQuote: true, // Use single quotes for strings
  semi: true, // Automatically add semicolons at the end of lines
  tabWidth: 2, // Tab indentation size, default: 2
  // htmlWhitespaceSensitivity: 'ignore', // Not sensitive to HTML global whitespace
  // jsxSingleQuote: true, // Use single quotes in JSX
  // jsxBracketSameLine: true, // Place '>' of multi-attribute HTML tags on the same line
  trailingComma: 'all',
  embeddedLanguageFormatting: 'auto', // Format embedded code
  useTabs: false, // Use tab indentation, default: false
  overrides: [
    {
      files: '*.json',
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
  ],
};
