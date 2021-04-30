import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
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
  nodeResolve(),
  commonjs(),
  replace(replaced),
  babel({
    babelHelpers: 'runtime',
    exclude: '**/node_modules/**', // fix must use the runtime plugin error
  }),
  terser(),
];

// settings
const outputs = {
  format: 'iife',
  sourcemap: false,
  banner: '/*! dsr-blog | DSRKafuU (https://dsrkafuu.su) | Copyright (c) Apache-2.0 License */',
};

export default [
  {
    input: 'assets/js/base.js',
    output: { file: 'public/assets/dsr-blog_base.min.js', ...outputs },
    plugins,
  },
  {
    input: 'assets/js/list.js',
    output: { file: 'public/assets/dsr-blog_list.min.js', ...outputs },
    plugins,
  },
  {
    input: 'assets/js/single.js',
    output: { file: 'public/assets/dsr-blog_single.min.js', ...outputs },
    plugins,
  },
];
