import { logInfo, logError } from '../plugins/loggers';
import { loadScript } from '../plugins/loaders';
import { SCRIPT_DISQUS } from '../plugins/constants';

const DATA_IDENTIFIER = 'data-identifier';
const ID_TITLE = 'title';
const ID_COMMENT_AREA = 'comment-area';
const ID_COMMENT_LOADING = 'comment-loading';

/**
 * load comment area
 */
async function loadComment() {
  // get data
  try {
    const identifier = document.querySelector(`#${ID_COMMENT_AREA}`).getAttribute(DATA_IDENTIFIER);
    const url = window.location.origin + window.location.pathname;
    const title = document.querySelector(`#${ID_TITLE}`).textContent.trim();
    window.disqus_config = function () {
      this.page.identifier = identifier;
      this.page.url = url;
      this.page.title = title;
    };
  } catch {
    logError('error init disqus settings');
    return;
  }

  // load disqus
  try {
    await loadScript(SCRIPT_DISQUS, { 'data-timestamp': +new Date() });
  } catch {
    logError('error loading disqus script');
    return;
  }

  // remove loading indicator
  const loading = document.querySelector(`#${ID_COMMENT_LOADING}`);
  const area = document.querySelector(`#${ID_COMMENT_AREA}`);
  loading && loading.setAttribute('style', 'display: none;');
  area && area.classList.add('comment--loaded');
  logInfo('successfully loaded disqus');
}

/**
 * lazyload comment area
 */
export default async () => {
  const el = document.querySelector(`#${ID_COMMENT_AREA}`);
  if (el) {
    const commentPromise = new Promise((resolve, reject) => {
      try {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // if comment area already appeared
              observer.disconnect(); // stop observer
              loadComment();
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
      logError('error initializing disqus observer');
      loadComment();
    });
    logInfo('disqus observer initialized');
  }
};
