import { logInfo } from './loggers';

// loaded sources
const set = new Set();

/**
 * @param {string} src
 * @param {Object} props
 * @returns {Promise<void>}
 */
export function loadScript(src, props = {}) {
  return new Promise((resolve, reject) => {
    // check if loaded
    if (!src || set.has(src)) {
      resolve();
    }
    set.add(src);
    // load script
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('src', src);
    if (props && typeof props === 'object') {
      for (let key of Object.keys(props)) {
        script.setAttribute(key, props[key]);
      }
    }
    script.addEventListener('load', () => {
      logInfo(`script ${(/[^/]+\.[^/]+$/.exec(src) || [])[0] || ''} loaded`);
      resolve();
    });
    script.addEventListener('error', () => {
      set.delete(src);
      reject();
    });
    document.body.appendChild(script);
  });
}

/**
 * @param {string} src
 * @param {Object} props
 * @returns {Promise<void>}
 */
export function loadStyle(src, props = {}) {
  return new Promise((resolve, reject) => {
    // check if loaded
    if (!src || set.has(src)) {
      resolve();
    }
    set.add(src);
    // load stylesheet
    const el = document.createElement('link');
    el.setAttribute('rel', 'stylesheet');
    el.setAttribute('href', src);
    if (props && typeof props === 'object') {
      for (let key of Object.keys(props)) {
        el.setAttribute(key, props[key]);
      }
    }
    el.addEventListener('load', () => {
      logInfo(`stylesheet ${(/[^/]+\.[^/]+$/.exec(src) || [])[0] || ''} loaded`);
      resolve();
    });
    el.addEventListener('error', () => {
      set.delete(src);
      reject();
    });
    // inject before other stylesheet
    let firstStyleEl = null;
    for (const el of document.head.children) {
      if (el && el?.getAttribute('rel') === 'stylesheet') {
        firstStyleEl = el;
      }
    }
    if (firstStyleEl) {
      document.head.insertBefore(el, firstStyleEl);
    }
  });
}
