/*! dsr-blog | DSRKafuU (https://dsrkafuu.su) | Copyright (c) Apache-2.0 License */

import { logInfo } from './plugins/loggers';
import {
  SEARCH_NW,
  SEARCH_SITE,
  SEARCH_URL,
  ID_SEARCH_CTRL,
  ID_SEARCH_INPUT,
} from './plugins/constants';

/**
 * preform search
 * @param {string} str
 */
function handleSearch(str) {
  if (!str) {
    logInfo('no search query set');
    return;
  }
  const url = new URL(SEARCH_URL);
  url.searchParams.append('q', str);
  url.searchParams.append('newwindow', SEARCH_NW);
  url.searchParams.append('as_sitesearch', SEARCH_SITE);
  logInfo(`perform search with ${str.split(' ').length} querys`);
  window.open(url.toString());
}

const ctrl = document.querySelector(`#${ID_SEARCH_CTRL}`);
const input = document.querySelector(`#${ID_SEARCH_INPUT}`);
if (!ctrl || !input) {
  logInfo('no need to init search');
}
ctrl.addEventListener('click', () => handleSearch(input.value));
