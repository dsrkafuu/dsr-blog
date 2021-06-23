import { logInfo, logError } from '../plugins/loggers';
import { loadScript } from '../plugins/loaders';
import { SCRIPT_DISQUS } from '../plugins/constants';

const ID_COMMENT_AREA = 'comment-area';
const ID_COMMENT_LOADING = 'comment-loading';
const ID_COMMENT_TEXT = 'comment-text';
const ID_COMMENT_RETRY = 'comment-retry';
const CONNECTION_TIMEOUT = 3000;

/**
 * check favicon connection
 * @returns {Promise<boolean>}
 */
async function checkConnection() {
  let avail = false;
  try {
    await new Promise((resolve, reject) => {
      const img = new Image();
      // reject after 3s
      const timeout = setTimeout(() => {
        reject();
      }, CONNECTION_TIMEOUT);
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
      img.src = `${new URL(SCRIPT_DISQUS).origin}/favicon.ico?t=${Date.now()}`;
    });
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
  let data = { page: {} };
  // get data
  try {
    window.disqus_config.apply(data);
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
      text.textContent = '无法连接到 Disqus 服务器';
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
  const el = document.querySelector(`#${ID_COMMENT_AREA}`);
  if (el) {
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
      observer.observe(el);
      window.DSRBLOG_DISQUS = true; // inited mark
    } catch (e) {
      // error or IntersectionObserver not supported
      logError('error initializing disqus observer', e);
      initComment();
    }
  }
};
