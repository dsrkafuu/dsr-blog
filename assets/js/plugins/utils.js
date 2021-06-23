import { SECTIONS } from './constants';

const DATA_SECTION = 'data-section';

/**
 * get current section
 * @returns {string}
 */
export function getSection() {
  const section = document.body.getAttribute(DATA_SECTION) || '';
  if (Object.values(SECTIONS).includes(section)) {
    return section;
  } else {
    return '';
  }
}
