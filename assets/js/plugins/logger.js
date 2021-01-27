/**
 * data logger
 */

export function logInfo(info, ...params) {
  console.info('[dsr-ca]', info, ...params);
}

export function logError(err, ...params) {
  console.error('[dsr-ca]', err, ...params);
}
