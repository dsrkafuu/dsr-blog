// 已加载依赖集
const scriptSet = new Set();
const styleSet = new Set();

/**
 * 动态加载外部依赖
 * @param {string} src 依赖链接
 * @param {Object} props 元素参数
 * @returns {Promise<void>}
 */
export function loadScript(src, props = {}) {
  return new Promise((resolve, reject) => {
    // 检查是否已载入
    if (!src || scriptSet.has(src)) {
      resolve();
    }
    scriptSet.add(src);
    // 载入脚本
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('src', src);
    if (props && typeof props === 'object') {
      for (let key of Object.keys(props)) {
        script.setAttribute(key, props[key]);
      }
    }
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => {
      scriptSet.delete(src);
      reject();
    });
    document.body.appendChild(script);
  });
}

/**
 * 动态加载外部依赖
 * @param {string} src 依赖链接
 * @param {Object} props 元素参数
 * @returns {Promise<void>}
 */
export function loadStyle(src, props = {}) {
  return new Promise((resolve, reject) => {
    // 检查是否已载入
    if (!src || styleSet.has(src)) {
      resolve();
    }
    styleSet.add(src);
    // 载入样式
    const el = document.createElement('link');
    el.setAttribute('rel', 'stylesheet');
    el.setAttribute('href', src);
    if (props && typeof props === 'object') {
      for (let key of Object.keys(props)) {
        el.setAttribute(key, props[key]);
      }
    }
    el.addEventListener('load', () => resolve());
    el.addEventListener('error', () => {
      styleSet.delete(src);
      reject();
    });
    document.head.appendChild(el);
  });
}
