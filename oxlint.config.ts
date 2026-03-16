import { defineConfig } from 'oxlint';

export default defineConfig({
  // https://oxc.rs/docs/guide/usage/linter/plugins.html#supported-plugins
  plugins: [
    'oxc',
    'node',
    'eslint',
    'import',
    'promise',
    'unicorn',
    'typescript',
    'react',
    'react-perf',
    'nextjs',
  ],
  rules: {
    'unicorn/no-new-array': 'off',
    'nextjs/no-page-custom-font': 'off',
    'nextjs/no-img-element': 'off',
  },
});
