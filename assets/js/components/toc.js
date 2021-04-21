import { logInfo } from '../plugins/loggers';

/**
 * 初始化移动端目录
 */
export default function () {
  const tocNode = document.getElementById('table-of-contents');
  const tocCtrl = document.getElementById('ctrl-toc');
  if (tocNode && tocCtrl) {
    tocCtrl.addEventListener('click', () => {
      if (Array.from(tocNode.classList).includes('hidden')) {
        tocNode.classList.remove('hidden');
      } else {
        tocNode.classList.add('hidden');
      }
    });
    logInfo('toc switcher inited');
  }
}
