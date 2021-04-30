import { logError, logInfo } from '../plugins/loggers';
import { ID_TOC_CONTENT, ID_TOC_CTRL } from '../plugins/constants';
/**
 * initialize toc control
 */
export default function () {
  const tocContent = document.querySelector(`#${ID_TOC_CONTENT}`);
  const tocCtrl = document.querySelector(`#${ID_TOC_CTRL}`);
  if (!tocContent && tocCtrl) {
    logInfo('no need to init toc');
    tocCtrl.remove();
    return;
  }
  if (!tocCtrl) {
    logError('toc related element not found');
    return;
  }
  tocCtrl.addEventListener('click', () => {
    if (Array.from(tocContent.classList).includes('active')) {
      tocContent.classList.remove('active');
    } else {
      tocContent.classList.add('active');
    }
  });
  logInfo('toc switcher inited');
}
