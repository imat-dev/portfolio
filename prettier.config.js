module.exports = {
  semi: false,
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  trailingComma: 'es5',
  bracketSpacing: true,
  endOfLine: 'auto',
  plugins: ['prettier-plugin-tailwindcss'],
  // Tailwind 4: the plugin reads theme/config from the CSS entry point
  tailwindStylesheet: './styles/globals.css',
}
