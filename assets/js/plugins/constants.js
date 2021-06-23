const IS_DEV = process.env.NODE_ENV === 'development';

// scripts and styles
export const SCRIPT_ZOOM = 'https://cdn.jsdelivr.net/npm/medium-zoom@1.0.6/dist/medium-zoom.min.js';
export const SCRIPT_PRISM_WITH_AUTO_LOADER =
  'https://cdn.jsdelivr.net/combine/' +
  'npm/prismjs@1.23.0/components/prism-core.min.js,' +
  'npm/prismjs@1.23.0/plugins/autoloader/prism-autoloader.min.js';
export const SCRIPT_PRISM_LANGS_PATH = 'https://cdn.jsdelivr.net/npm/prismjs@1.23.0/components/';
export const SCRIPT_DISQUS = `https://dsrblog${IS_DEV ? '-dev' : ''}.disqus.com/embed.js`;

// search engine
export const SEARCH_URL = 'https://www.google.com/search';
export const SEARCH_SITE = 'blog.dsrkafuu.su/post';

// sentry
export const SENTRY_DSN = process.env.DSR_SENTRY_DSN;
