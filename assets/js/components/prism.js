import { loadScript } from '../plugins/loaders';
import { logError } from '../plugins/loggers';
import { SCRIPT_PRISM_WITH_AUTO_LOADER, SCRIPT_PRISM_LANGS_PATH } from '../plugins/constants';

/**
 * init prismjs
 */
export default async () => {
  if (document.querySelector('pre code')) {
    // set to manual mode
    window.Prism = window.Prism || {};
    window.Prism.manual = true;
    // loading
    loadScript(SCRIPT_PRISM_WITH_AUTO_LOADER)
      .then(() => {
        window.Prism.plugins.autoloader.languages_path = SCRIPT_PRISM_LANGS_PATH;
        window.Prism.highlightAll();
      })
      .catch((e) => {
        logError('error loading prism', e);
      });
  }
};
