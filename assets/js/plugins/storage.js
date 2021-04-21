import { logError } from './loggers';

/**
 * @param {string} key
 */
export function getLS(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    logError('error loading localStorage');
    return null;
  }
}

/**
 * @param {string} key
 * @param {any} value
 */
export function setLS(key, value) {
  try {
    return localStorage.setItem(key, JSON.stringify(value));
  } catch {
    logError('error setting localStorage');
  }
}
