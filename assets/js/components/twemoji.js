/**
 * init twemoji
 */
export default () => {
  const content = document.querySelector('div.content');
  if (content && window.twemoji) {
    window.twemoji.parse(content, { folder: 'svg', ext: '.svg' });
  }
};
