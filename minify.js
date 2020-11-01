#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
// html
const html = require('html-minifier-terser').minify;
// css
const postcss = require('postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
// js
const terser = require('terser').minify;

// files
const allFiles = {
  '.html': [],
  '.css': [],
  '.js': [],
};
/**
 * get all files need to minify
 * @param {String} dirPath
 */
function getFiles(dirPath) {
  // files in current folder
  let files;
  try {
    files = fs.readdirSync(dirPath, { encoding: 'utf-8' });
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
console.log(`[DSRMIN] Scanning files...`);
getFiles(path.resolve('./public'));
console.log('[DSRMIN] Scanning files done.');

// minify
async function minifyFiles() {
  console.log('[DSRMIN] Minification started...');
  const processPromises = [];
  // minify htmls
  allFiles['.html'].forEach((val) => {
    processPromises.push(
      new Promise((resolve, reject) => {
        try {
          const content = fs.readFileSync(val, { encoding: 'utf-8' });
          const result = html(content, {
            caseSensitive: true,
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            keepClosingSlash: true,
            preserveLineBreaks: true,
            minifyCSS: true,
            minifyJS: true,
            sortAttributes: true,
            sortClassName: true,
          });
          fs.writeFileSync(val, result);
          resolve();
        } catch (e) {
          reject(e);
        }
      })
    );
  });
  // minify csses
  allFiles['.css'].forEach((val) => {
    processPromises.push(
      new Promise((resolve, reject) => {
        try {
          const content = fs.readFileSync(val, { encoding: 'utf-8' });
          postcss([cssnano, autoprefixer])
            .process(content, { from: val })
            .then((result) => {
              fs.writeFileSync(val, result.css);
              resolve();
            });
        } catch (e) {
          reject(e);
        }
      })
    );
  });
  // minify jses
  allFiles['.js'].forEach((val) => {
    processPromises.push(
      new Promise((resolve, reject) => {
        try {
          const content = fs.readFileSync(val, { encoding: 'utf-8' });
          terser(content).then((result) => {
            fs.writeFileSync(val, result.code);
            resolve();
          });
        } catch (e) {
          reject(e);
        }
      })
    );
  });
  await Promise.all(processPromises);
  console.log('[DSRMIN] Minification done.');
  return;
}
minifyFiles();
