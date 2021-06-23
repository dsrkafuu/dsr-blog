import { logInfo, logError } from '../plugins/loggers';
import { loadScript } from '../plugins/loaders';
import { SCRIPT_DISQUS } from '../plugins/constants';

const ID_COMMENT_AREA = 'comment-area';
const ID_COMMENT_LOADING = 'comment-loading';

/**
 * ensure trailing slash
 * @param {string} str
 * @param {boolean} remove whether remove trail
 */
function ensureTrail(str, remove = false) {
  if (remove) {
    return str.replace(/\/$/gi, '');
  } else if (!/\/$/.exec(str)) {
    return str + '/';
  } else {
    return str;
  }
}

/**
 * load comment area
 */
async function loadComment() {
  let data = {};
  // get data
  try {
    data.url = ensureTrail(window.location.origin + window.location.pathname);
    data.identifier = ensureTrail(window.location.pathname, true);
    window.disqus_config = function () {
      this.page.identifier = data.identifier;
      this.page.url = data.url;
    };
  } catch (e) {
    logError('error init disqus settings', e);
    return;
  }

  // load disqus
  try {
    await loadScript(SCRIPT_DISQUS, { 'data-timestamp': +new Date() });
  } catch (e) {
    logError('error loading disqus script', e);
    return;
  }

  // remove loading indicator
  const loading = document.querySelector(`#${ID_COMMENT_LOADING}`);
  const area = document.querySelector(`#${ID_COMMENT_AREA}`);
  loading && loading.setAttribute('style', 'display: none;');
  area && area.classList.add('comment--loaded');
  logInfo('successfully loaded disqus', data);
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
            // if comment area already appeared
            if (entry.isIntersecting) {
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
    commentPromise.catch((e) => {
      logError('error initializing disqus observer', e);
      loadComment();
    });
  }
};
