import { loadScript } from '../plugins/loaders';
import { ATTR_ZOOMABLE, SCRIPT_ZOOM } from '../plugins/constants';
import { logError } from '../plugins/loggers';

/**
 * init medium-zoom
 * @returns {Promise<void>}
 */
export default async () => {
  if (document.querySelector(`[${ATTR_ZOOMABLE}]`)) {
    // loading
    loadScript(SCRIPT_ZOOM)
      .then(() => {
        window.mediumZoom &&
          window.mediumZoom(`[${ATTR_ZOOMABLE}]`, {
            background: 'var(--color-bg)',
          });
      })
      .catch((e) => {
        logError('error loading medium-zoom', e);
      });
  }
};
