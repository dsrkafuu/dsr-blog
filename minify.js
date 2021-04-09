// deps
const path = require('path');
const fs = require('fs');
// html
const html = require('html-minifier-terser').minify;
// css
const postcss = require('postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

// files
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
console.log('[dsr-blog] scanning files...');
getFiles(path.resolve('./public'));
console.log('[dsr-blog] scanning files done.');

// minify
async function minifyFiles() {
  console.log('[dsr-blog] works started...');
  const processPromises = [];

  allFiles['.html'].forEach((val) => {
    processPromises.push(
      new Promise((resolve, reject) => {
        try {
          const content = fs.readFileSync(val, { encoding: 'utf-8' });
          const result = html(content, {
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
          });
          fs.writeFileSync(val, result);
          resolve();
        } catch (e) {
          reject(e);
        }
      })
    );
  });

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

  await Promise.all(processPromises);
  console.log('[dsr-blog] works done.');
  return;
}
minifyFiles();
