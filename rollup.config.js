import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';

// env replace
const replaced = {};
for (let key of Object.keys(process.env)) {
  if (key === 'NODE_ENV' || key.startsWith('DSR_')) {
    replaced[`process.env.${key}`] = JSON.stringify(process.env[key]);
    replaced[`import.meta.env.${key}`] = JSON.stringify(process.env[key]);
  }
}

// setup plugins
const plugins = [
  replace(replaced),
  babel({
    babelHelpers: 'runtime',
    exclude: '**/node_modules/**', // fix must use the runtime plugin error
  }),
  terser(),
];

// settings
const settings = {
  format: 'iife',
  sourcemap: false,
  banner: '/*! dsr-blog | DSRKafuU (https://dsrkafuu.su) | Copyright (c) Apache-2.0 License */',
};

export default [
  {
    input: 'assets/js/index.js',
    output: { file: 'public/assets/dsr-blog_index.min.js', ...settings },
    plugins,
  },
  {
    input: 'assets/js/list.js',
    output: { file: 'public/assets/dsr-blog_list.min.js', ...settings },
    plugins,
  },
  {
    input: 'assets/js/single.js',
    output: { file: 'public/assets/dsr-blog_single.min.js', ...settings },
    plugins,
  },
];
