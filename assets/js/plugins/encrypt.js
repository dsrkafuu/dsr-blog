/**
 * data encrypt processor
 */

import { logError } from './logger';

export function encData(string) {
  try {
    return window.btoa(window.btoa(string).split('').reverse().join(''));
  } catch (e) {
    logError(e);
  }
}

export function decData(string) {
  try {
    return window.atob(window.atob(string).split('').reverse().join(''));
  } catch (e) {
    logError(e);
  }
}
