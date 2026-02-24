import globals from 'globals'
import pluginJs from 'eslint-plugin-react-hooks'
import pluginReactConfig from 'eslint-plugin-react-refresh'

export default [
  {
    ignores: ['dist/', 'node_modules/', 'src/test/']
  },
  {
    files: ['**/*.{js,mjs,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      'react-hooks': pluginJs,
      'react-refresh': pluginReactConfig
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReactConfig.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      'no-unused-vars': 'warn'
    }
  }
]
