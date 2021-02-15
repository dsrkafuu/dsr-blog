// find module in node_modules
import { nodeResolve } from '@rollup/plugin-node-resolve';
// convert cjs module to esm
import commonjs from '@rollup/plugin-commonjs';
// transpile code
import { babel } from '@rollup/plugin-babel';
// minify
import { terser } from 'rollup-plugin-terser';

const plugins = [
  nodeResolve(),
  commonjs(),
  babel({
    babelHelpers: 'bundled',
  }),
  terser(),
];
const sourcemap = false;
const banner =
  '/*! github.com/dsrkafuu/dsr-ca | DSRKafuU <dsrkafuu.su> | Copyright (c) Apache-2.0 License */';

export default [
  {
    input: 'assets/js/list.js',
    output: {
      file: 'public/assets/dsr-ca_list.min.js',
      format: 'iife',
      sourcemap,
      banner,
    },
    plugins,
  },
  {
    input: 'assets/js/search.js',
    output: {
      file: 'public/assets/dsr-ca_search.min.js',
      format: 'iife',
      sourcemap,
      banner,
    },
    plugins,
  },
  {
    input: 'assets/js/single.js',
    output: {
      file: 'public/assets/dsr-ca_single.min.js',
      format: 'iife',
      sourcemap,
      banner,
    },
    plugins,
  },
];
