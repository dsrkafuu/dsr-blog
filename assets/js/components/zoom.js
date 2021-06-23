import { loadScript } from '../plugins/loaders';
import { logError } from '../plugins/loggers';
import { SCRIPT_ZOOM } from '../plugins/constants';

const DATA_ZOOMABLE = 'data-zoomable';

/**
 * init medium-zoom
 */
export default async () => {
  if (document.querySelector(`[${DATA_ZOOMABLE}]`)) {
    try {
      await loadScript(SCRIPT_ZOOM);
      if (window.mediumZoom) {
        window.mediumZoom(`[${DATA_ZOOMABLE}]`, {
          background: 'var(--color-bg)',
        });
      }
    } catch (e) {
      logError('error init medium-zoom', e);
    }
  }
};
