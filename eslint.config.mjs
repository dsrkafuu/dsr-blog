import config from '@dsrca/config/eslint/eslint.config.js';

/**
 * @type {import('eslint').ESLint.ConfigData}
 */
export default [
  ...config,
  {
    ignores: ['build/**/*', 'node_modules/**/*'],
  },
];
