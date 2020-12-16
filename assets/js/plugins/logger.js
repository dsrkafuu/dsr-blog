/**
 * data logger
 */

export function logInfo(info, ...params) {
  console.info('[DSRCA]', info, ...params);
}

export function logError(err, ...params) {
  console.error('[DSRCA]', err, ...params);
}
