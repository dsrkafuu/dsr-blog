// 已加载依赖集
const scriptSet = new Set();

/**
 * 动态加载外部依赖
 * @param {string} src 依赖链接
 * @param {Object} props 元素参数
 * @returns {Promise<void>}
 */
function loadScript(src, props = {}) {
  return new Promise((resolve, reject) => {
    // 检查是否已载入
    if (!src || scriptSet.has(src)) {
      resolve();
    }
    // 载入脚本
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('src', src);
    if (props && typeof props === 'object') {
      for (let key of Object.keys(props)) {
        script.setAttribute(key, props[key]);
      }
    }
    script.addEventListener('load', () => {
      scriptSet.add(src);
      resolve();
    });
    script.addEventListener('error', () => reject());
    document.body.appendChild(script);
  });
}

export default loadScript;
