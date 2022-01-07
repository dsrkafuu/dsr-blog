/**
 * initialize toc control
 */
export default () => {
  const tocCtrl = document.querySelector(`#toc-btn`);
  const tocContent = document.querySelector(`#toc-overlay`);
  if (!tocContent && tocCtrl) {
    tocCtrl.remove();
    return;
  }
  if (!tocCtrl) {
    return;
  }
  tocCtrl.addEventListener('click', () => {
    if (Array.from(tocContent.classList).includes('toc--active')) {
      tocContent.classList.remove('toc--active');
    } else {
      tocContent.classList.add('toc--active');
    }
  });
};
