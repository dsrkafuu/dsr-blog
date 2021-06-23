import { logInfo, logError } from '../plugins/loggers';
import { loadScript } from '../plugins/loaders';
import { SCRIPT_DISQUS } from '../plugins/constants';

/**
 * load comment area
 */
async function loadComment() {
  // get data
  try {
    const identifier = document.querySelector('#comment').getAttribute('data-identifier');
    const url = window.location.origin + window.location.pathname;
    const title = document.querySelector('#title').textContent.trim();
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
  const loading = document.querySelector('#loading');
  const wrapper = document.querySelector('#comment');
  loading && loading.setAttribute('style', 'display: none;');
  wrapper && wrapper.classList.add('comment__wrapper--loaded');
  logInfo('successfully loaded disqus');
}

/**
 * IntersectionObserver lazyload comment area
 * @returns {Promise<void>}
 */
export default async () => {
  const el = document.querySelector('#comment');
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
