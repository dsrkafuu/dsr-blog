/*! dsr-blog | DSRKafuU (https://dsrkafuu.su) | Copyright (c) Apache-2.0 License */

// mobile toc
import toc from './components/toc';
toc();

// clipboard injector
import clipboard from './components/clipboard';
if (process.env.NODE_ENV === 'production') {
  clipboard();
}

// gitalk comment
import comment from './components/comment';
comment();

// prismjs
import { loadScript } from './plugins/loaders';
import { SCRIPT_PRISM_LOADER, PRISM_LANGS_PATH } from './plugins/constants';
import { logError } from './plugins/loggers';
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
