/**
 * data logger
 */

export function logInfo(info, ...params) {
  console.info('[LOGGER]', info, ...params);
}

export function logError(err, ...params) {
  console.error('[ERROR]', err, ...params);
}
