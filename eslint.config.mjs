import js from '@eslint/js'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

const config = [
  {
    ignores: [
      'node_modules/**',
      'public/**',
      '.next/**',
      '.cache/**',
      '.vscode/**',
      '.superpowers/**',
      'docs/**',
      'package-lock.json',
      'yarn.lock',
    ],
  },
  js.configs.recommended,
  ...nextCoreWebVitals,
  prettierRecommended,
  {
    rules: {
      'prettier/prettier': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': 'off',
      'react/no-unescaped-entities': 'off',
      // New in react-hooks 7 (React Compiler rules). Flags pre-existing infinite-paging
      // code; kept visible as a warning instead of failing lint.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]

export default config
