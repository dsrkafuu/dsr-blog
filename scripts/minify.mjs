/**
 * minify files
 */

import fs from 'fs';
import path from 'path';
import url from 'url';
import glob from 'glob';
import chalk from 'chalk';
import html from 'html-minifier-terser';
import postcss from 'postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// getting raw files
console.log(chalk.blue('fetching raw files...'));
const t = Date.now();
const htmlArr = glob
  .sync('public/**/*.html')
  .map((file) => path.resolve(__dirname, '../', file));
const cssArr = glob
  .sync('public/**/*.css')
  .map((file) => path.resolve(__dirname, '../', file));
console.log(chalk.green(`raw files fetched in ${Date.now() - t}ms`));

// minify html
const t1 = Date.now();
const htmlWorkers = [];
htmlArr.forEach((file) => {
  htmlWorkers.push(
    new Promise((resolve, reject) => {
      try {
        const content = fs.readFileSync(file, { encoding: 'utf-8' });
        html
          .minify(content, {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            ignoreCustomComments: [/^!/, /^\s*#/],
            keepClosingSlash: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            sortAttributes: true,
            sortClassName: true,
            useShortDoctype: true,
            minifyCSS: true,
            minifyJS: true,
          })
          .then((result) => {
            fs.writeFileSync(file, result);
            resolve();
          });
      } catch (e) {
        reject(e);
      }
    })
  );
});
Promise.all(htmlWorkers)
  .then(() =>
    console.log(chalk.green(`done with html files in ${Date.now() - t1}ms`))
  )
  .catch((e) => console.error(e));

// minify and prefix css
const t2 = Date.now();
const cssWorkers = [];
cssArr.forEach((file) => {
  cssWorkers.push(
    new Promise((resolve, reject) => {
      try {
        const content = fs.readFileSync(file, { encoding: 'utf-8' });
        postcss([autoprefixer, cssnano])
          .process(content, { from: file, to: file })
          .then((result) => {
            fs.writeFileSync(file, result.css.replace(/\r?\n/g, ''));
            if (result.map) {
              fs.writeFileSync(path.join(file + '.map'), result.map.toString());
            }
            resolve();
          });
      } catch (e) {
        reject(e);
      }
    })
  );
});
Promise.all(cssWorkers)
  .then(() =>
    console.log(chalk.green(`done with css files in ${Date.now() - t2}ms`))
  )
  .catch((e) => console.error(e));
