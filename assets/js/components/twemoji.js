/**
 * init twemoji
 */
export default () => {
  const content = document.querySelector('div.content');
  if (content && window.twemoji) {
    window.twemoji.parse(content, {
      base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
      folder: 'svg',
      ext: '.svg',
    });
  }
};
