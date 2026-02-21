import js from '@eslint/js';
import next from 'eslint-config-next';
import nextTypes from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';

export default defineConfig([
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  next,
  nextTypes,
  prettier,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react/prop-types': 'off',
      '@next/next/no-img-element': 'off',
      '@next/next/no-page-custom-font': 'off',
    },
  },
]);
