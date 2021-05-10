import { logInfo, logError } from '../plugins/loggers';
import { loadScript, loadStyle } from '../plugins/loaders';
import {
  SCRIPT_GITALK,
  STYLE_GITALK,
  ID_COMMENT_CONTENT,
  ID_COMMENT_LOADING,
  GITALK_ID,
  GITALK_SECRET,
  GITALK_REPO,
  GITALK_OWNER,
  GITALK_ADMIN,
} from '../plugins/constants';

/**
 * load comment area
 * @param {Element} el
 */
async function loadComment(el) {
  try {
    await Promise.all([loadScript(SCRIPT_GITALK), loadStyle(STYLE_GITALK)]);
  } catch {
    window.Gitalk = null;
  }
  if (!window.Gitalk) {
    logError('error loading gitalk script');
    return;
  }
  const gitalk = new window.Gitalk({
    clientID: GITALK_ID,
    clientSecret: GITALK_SECRET,
    repo: GITALK_REPO,
    owner: GITALK_OWNER,
    admin: GITALK_ADMIN,
    id: el.getAttribute('data-identifier'),
    createIssueManually: true,
    flipMoveOptions: {
      staggerDelayBy: 200,
      appearAnimation: 'fade',
      enterAnimation: 'fade',
      leaveAnimation: 'fade',
    },
  });
  // remove loading indicator
  const loadEl = document.querySelector(`#${ID_COMMENT_LOADING}`);
  loadEl && loadEl.setAttribute('style', 'display: none;');
  gitalk.render(el.getAttribute('id'));
  logInfo('successfully loaded gitalk');
}

/**
 * IntersectionObserver lazyload comment area
 * @returns {Promise<void>}
 */
export default async () => {
  const el = document.querySelector(`#${ID_COMMENT_CONTENT}`);
  if (el) {
    const commentPromise = new Promise((resolve, reject) => {
      try {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // if comment area already appeared
              observer.disconnect(); // stop observer
              loadComment(el);
              resolve();
            }
          });
        });
        // observe DOM
        observer.observe(el);
      } catch {
        reject();
      }
    });
    // error or IntersectionObserver not supported
    commentPromise.catch(() => {
      logError('error initializing gitalk observer');
      loadComment(el);
    });
    logInfo('gitalk observer initialized');
  }
};
