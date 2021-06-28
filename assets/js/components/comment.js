import { logInfo, logError } from '../plugins/loggers';
import { loadScript } from '../plugins/loaders';
import {
  SCRIPT_UTTERANCES,
  UTTERANCES_REPO,
  UTTERANCES_TERM_PREFIX,
  UTTERANCES_LABEL,
} from '../plugins/constants';

export const ID_COMMENT_AREA = 'comment-area';
export const ID_COMMENT_LOADING = 'comment-loading';
export const ID_COMMENT_TEXT = 'comment-text';
export const ID_COMMENT_RETRY = 'comment-retry';
export const ID_COMMENT_CONTENT = 'comment-content';

/**
 * check api connection
 * @returns {Promise<boolean>}
 */
async function checkConnection() {
  /**
   * add a check
   * @param {string} src
   */
  const addCheck = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      // reject after 2s
      const timeout = setTimeout(() => {
        reject();
      }, 2000);
      // on load or error handler
      const onload = () => {
        clearTimeout(timeout);
        resolve();
      };
      const onerror = () => {
        clearTimeout(timeout);
        reject();
      };
      img.addEventListener('load', onload);
      img.addEventListener('error', onerror);
      img.src = `${src}?t=${Date.now()}`;
    });

  let avail = false;
  try {
    await Promise.all([
      addCheck('https://github.githubassets.com/favicons/favicon.png'),
      addCheck('https://docs.github.com/assets/images/site/favicon.png'),
    ]);
    avail = true;
  } catch {
    avail = false;
  }
  return avail;
}

/**
 * load comment area
 */
async function loadComment() {
  let path = window.location.pathname;
  if (!/\/$/.exec(path)) {
    path += '/';
  }
  const attrs = {
    repo: UTTERANCES_REPO,
    'issue-term': `${UTTERANCES_TERM_PREFIX}:${path}`,
    label: UTTERANCES_LABEL,
    theme: 'preferred-color-scheme',
    crossorigin: 'anonymous',
  };

  // load utterances
  const content = document.querySelector(`#${ID_COMMENT_CONTENT}`);
  try {
    await loadScript(SCRIPT_UTTERANCES, attrs, content);
  } catch (e) {
    logError('error loading utterances script', e);
    return;
  }

  // remove loading indicator when utterances loaded
  const interval = setInterval(() => {
    const height = getComputedStyle(content).getPropertyValue('height');
    if (!/^0/.exec(height)) {
      clearInterval(interval);
      const loading = document.querySelector(`#${ID_COMMENT_LOADING}`);
      const area = document.querySelector(`#${ID_COMMENT_AREA}`);
      loading && loading.setAttribute('style', 'display: none;');
      area && area.classList.add('comment--loaded');
      logInfo('successfully loaded utterances', attrs);
    }
  }, 200);
}

/**
 * go connection check and load comment area
 */
async function initComment() {
  const text = document.querySelector(`#${ID_COMMENT_TEXT}`);
  const retry = document.querySelector(`#${ID_COMMENT_RETRY}`);
  if (!text || !retry) {
    return;
  }
  // go check handler
  const goCheck = async () => {
    if (await checkConnection()) {
      await loadComment();
    } else {
      text.textContent = '无法连接到 GitHub 服务器';
      retry.style.display = 'block';
    }
  };
  // retry button
  retry.addEventListener('click', async () => {
    text.textContent = '评论区正在加载';
    retry.style.display = 'none';
    await goCheck();
  });
  await goCheck();
}

/**
 * lazyload comment area
 */
export default async () => {
  const area = document.querySelector(`#${ID_COMMENT_AREA}`);
  if (area) {
    try {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          // if comment area already appeared
          if (entry.isIntersecting) {
            observer.disconnect(); // stop observer
            initComment();
          }
        });
      });
      // observe DOM
      observer.observe(area);
    } catch (e) {
      // error or IntersectionObserver not supported
      logError('error initializing utterances observer', e);
      initComment();
    }
  }
};
