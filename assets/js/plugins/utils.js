export const SECTIONS = {
  INDEX: 'index',
  LIST: 'list',
  SINGLE: 'single',
  CODE: 'code',
  TAGS: 'tags',
  FRIENDS: 'friends',
};

/**
 * get current section
 * @returns {string}
 */
export function getSection() {
  const section = document.body.getAttribute('data-section') || '';
  if (Object.values(SECTIONS).includes(section)) {
    return section;
  } else {
    return '';
  }
}
