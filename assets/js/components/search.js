import { logInfo } from '../plugins/loggers';

export const SEARCH_URL = 'https://www.google.com/search';
export const SEARCH_SITE = 'blog.dsrkafuu.net/post';

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
export default () => {
  const ctrl = document.querySelector('#search-btn');
  const input = document.querySelector('#search-input');
  if (ctrl && input) {
    ctrl.addEventListener('click', () => handleSearch(input.value));
  }
};
