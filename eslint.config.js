import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default [
  { ignores: ['dist', 'docs'] },
  js.configs.recommended,
  {
    files: ['*.config.js', '*.config.cjs'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        React: true,
        BASE_PATH: 'readonly',
        API_PATH: 'readonly',
        CDN_PATH: 'readonly',
        PLAY_API_PATH: 'readonly',
        MOCKUP_BOOL: 'readonly',
        MODE: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-no-target-blank': 'off',
      'react/prop-types': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars': 'off',
      'react/no-unknown-property': ['error', { ignore: ['webkitplaysinline'] }],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  prettierConfig,
];
