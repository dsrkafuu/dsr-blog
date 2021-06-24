import { logInfo } from '../plugins/loggers';
import { SEARCH_SITE, SEARCH_URL } from '../plugins/constants';

export const ID_SEARCH_BTN = 'search-btn';
export const ID_SEARCH_INPUT = 'search-input';

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
  url.searchParams.append('newwindow', '1');
  url.searchParams.append('as_sitesearch', SEARCH_SITE);
  logInfo(`perform search with ${str.split(' ').length} querys`);
  window.open(url.toString());
}

/**
 * add search listener
 */
export default async () => {
  const ctrl = document.querySelector(`#${ID_SEARCH_BTN}`);
  const input = document.querySelector(`#${ID_SEARCH_INPUT}`);
  if (ctrl && input) {
    ctrl.addEventListener('click', () => handleSearch(input.value));
  }
};
