/*! dsr-blog | DSRKafuU (https://dsrkafuu.su) | Copyright (c) Apache-2.0 License */
import VSearch from './components/vsearch';
import loadScript from './plugins/loadScript';
import { SCRIPT_VUE } from './plugins/constants';
import { logError } from './plugins/logger';

(async () => {
  try {
    await loadScript(SCRIPT_VUE);
  } catch {
    window.Vue = null;
  }
  if (!Vue) {
    logError('error loading vue.js');
    return;
  }
  Vue.createApp(VSearch).mount('#app');
})();
