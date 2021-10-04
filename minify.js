const path = require('path');
const fs = require('fs');
const html = require('html-minifier-terser');
const postcss = require('postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const chalk = require('chalk');

// files needs to be processed
const allFiles = {
  '.html': [],
  '.css': [],
};

/**
 * get all files need to minify
 * @param {string} dirPath
 */
function getFiles(dirPath) {
  // files in current folder
  let files;
  try {
    files = fs.readdirSync(dirPath);
  } catch (e) {
    console.error(e);
    return;
  }
  if (files.length === 0) {
    return;
  }
  // check all sub files
  files.forEach((val) => {
    const filePath = path.join(dirPath, val);
    const fileStats = fs.statSync(filePath);
    if (fileStats.isFile()) {
      // if is file
      const extention = path.extname(filePath);
      if (Object.keys(allFiles).includes(extention)) {
        allFiles[extention].push(filePath);
      }
    } else if (fileStats.isDirectory()) {
      // if is dir
      getFiles(filePath);
    }
    return;
  });
}

const t = Date.now();
console.log(chalk.blue('fetching raw files...'));
getFiles(path.resolve(__dirname, './public'));
console.log(chalk.green(`raw files fetched in ${Date.now() - t}ms`));

// minify
const t1 = Date.now();
console.log(chalk.blue('processing html files...'));
const htmlWorkers = [];
allFiles['.html'].forEach((val) => {
  htmlWorkers.push(
    new Promise((resolve, reject) => {
      try {
        const content = fs.readFileSync(val, { encoding: 'utf8' });
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
            fs.writeFileSync(val, result);
            resolve();
          });
      } catch (e) {
        reject(e);
      }
    })
  );
});
Promise.all(htmlWorkers)
  .then(() => console.log(chalk.green(`done with html files in ${Date.now() - t1}ms`)))
  .catch((e) => console.error(e));

const t2 = Date.now();
console.log(chalk.blue('processing css files...'));
const cssWorkers = [];
allFiles['.css'].forEach((val) => {
  cssWorkers.push(
    new Promise((resolve, reject) => {
      try {
        const content = fs.readFileSync(val, { encoding: 'utf8' });
        postcss([cssnano, autoprefixer])
          .process(content, { from: val, to: val })
          .then((result) => {
            fs.writeFileSync(val, result.css);
            if (result.map) {
              fs.writeFileSync(val + '.map', result.map.toString());
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
  .then(() => console.log(chalk.green(`done with css files in ${Date.now() - t2}ms`)))
  .catch((e) => console.error(e));
