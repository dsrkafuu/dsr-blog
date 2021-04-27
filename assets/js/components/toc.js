import { logInfo } from '../plugins/loggers';

/**
 * 初始化移动端目录
 */
export default function () {
  const tocContent = document.querySelector('#content-toc');
  const tocCtrl = document.querySelector('#ctrl-toc');
  if (tocContent && tocCtrl) {
    tocCtrl.addEventListener('click', () => {
      if (Array.from(tocContent.classList).includes('active')) {
        tocContent.classList.remove('active');
      } else {
        tocContent.classList.add('active');
      }
    });
    logInfo('toc switcher inited');
  }
}
