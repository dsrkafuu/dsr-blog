const ID_TOC_BTN = 'toc-btn';
const ID_TOC_OVERLAY = 'toc-overlay';

/**
 * initialize toc control
 */
export default async () => {
  const tocContent = document.querySelector(`#${ID_TOC_OVERLAY}`);
  const tocCtrl = document.querySelector(`#${ID_TOC_BTN}`);
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
