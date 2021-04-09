import { logError } from './logger';

/**
 * @param {string} key
 */
export const getLS = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    logError('error loading localStorage');
    return null;
  }
};

/**
 * @param {string} key
 * @param {any} value
 */
export const setLS = (key, value) => {
  try {
    return localStorage.setItem(key, JSON.stringify(value));
  } catch {
    logError('error setting localStorage');
  }
};
