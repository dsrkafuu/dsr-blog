import { nodeResolve } from '@rollup/plugin-node-resolve'; // find module in node_modules
import commonjs from '@rollup/plugin-commonjs'; // convert cjs module to esm
import { babel } from '@rollup/plugin-babel'; // transpile code
import { terser } from 'rollup-plugin-terser'; // minify
import replace from '@rollup/plugin-replace'; // support process.env

const plugins = [
  nodeResolve(),
  commonjs(),
  replace({
    'process.env.GITALK_CLIENT_ID': JSON.stringify(process.env.GITALK_CLIENT_ID),
    'process.env.GITALK_CLIENT_SECRET': JSON.stringify(process.env.GITALK_CLIENT_SECRET),
    'process.env.SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN),
  }),
  babel({
    babelHelpers: 'runtime',
    skipPreflightCheck: true, // fix must use the runtime plugin error
  }),
  terser(),
];
const sourcemap = false;
const banner =
  '/*! dsr-blog | DSRKafuU (https://dsrkafuu.su) | Copyright (c) Apache-2.0 License */';

export default [
  {
    input: 'assets/js/common.js',
    output: { file: 'public/assets/dsr-blog_common.min.js', format: 'iife', sourcemap, banner },
    plugins,
  },
  {
    input: 'assets/js/list.js',
    output: { file: 'public/assets/dsr-blog_list.min.js', format: 'iife', sourcemap, banner },
    plugins,
  },
  {
    input: 'assets/js/search.js',
    output: { file: 'public/assets/dsr-blog_search.min.js', format: 'iife', sourcemap, banner },
    plugins,
  },
  {
    input: 'assets/js/single.js',
    output: { file: 'public/assets/dsr-blog_single.min.js', format: 'iife', sourcemap, banner },
    plugins,
  },
];
