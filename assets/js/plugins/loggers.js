/**
 * @param {any[]} args
 */
export function logInfo(...args) {
  console.info('%c[dsr-blog]', 'color: #8aa2d3', ...args);
}

/**
 * @param {any[]} args
 */
export function logError(...args) {
  console.error('[dsr-blog]', ...args);
}
