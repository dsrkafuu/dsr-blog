import { loadScript } from '../plugins/loaders';
import { SCRIPT_PRISM_LOADER, PRISM_LANGS_PATH } from '../plugins/constants';
import { logError } from '../plugins/loggers';

/**
 * init prismjs
 * @returns {Promise<void>}
 */
export default async () => {
  if (document.querySelector('pre code')) {
    // set to manual mode
    window.Prism = window.Prism || {};
    window.Prism.manual = true;
    // loading
    loadScript(SCRIPT_PRISM_LOADER)
      .then(() => {
        window.Prism.plugins.autoloader.languages_path = PRISM_LANGS_PATH;
        window.Prism.highlightAll();
      })
      .catch((e) => {
        logError('error loading prism', e);
      });
  }
};
