// scripts and styles
export const SCRIPT_GITALK = 'https://cdn.jsdelivr.net/npm/gitalk@1.7.2/dist/gitalk.min.js';
export const STYLE_GITALK = 'https://cdn.jsdelivr.net/npm/gitalk@1.7.2/dist/gitalk.min.css';
export const SCRIPT_ZOOM = 'https://cdn.jsdelivr.net/npm/medium-zoom@1.0.6/dist/medium-zoom.min.js';
export const SCRIPT_PRISM_LOADER =
  'https://cdn.jsdelivr.net/combine/npm/prismjs@1.23.0/components/prism-core.min.js,npm/prismjs@1.23.0/plugins/autoloader/prism-autoloader.min.js';
export const PRISM_LANGS_PATH = 'https://cdn.jsdelivr.net/npm/prismjs@1.23.0/components/';
const dev = process.env.NODE_ENV === 'development';
export const SCRIPT_DISQUS = `https://dsrblog${dev ? '-dev' : ''}.disqus.com/embed.js`;

// search engine
export const SEARCH_URL = 'https://www.google.com/search';
export const SEARCH_NW = '1';
export const SEARCH_SITE = 'blog.dsrkafuu.su/post';

// dom attributes and ids
export const ATTR_THEME = 'data-theme';
export const ATTR_SECTION = 'data-section';
export const ATTR_ZOOMABLE = 'data-zoomable';
export const ID_THEME_CTRL = 'ctrl-adjust';
export const ID_CONPATIBILITY = 'content-compat';
export const ID_TOC_CTRL = 'ctrl-toc';
export const ID_TOC_CONTENT = 'content-toc';
export const ID_SEARCH_CTRL = 'ctrl-search';
export const ID_SEARCH_INPUT = 'input-search';

// local storage keys
export const STORAGE_THEME = 'dsr-blog_theme';

// clipboard
export const COPY_LICENSE = `
----------------------------------------
本站内容采用 CC BY-NC-SA 4.0 进行许可；
商业转载请联系作者授权，非商业转载请注明出处；
来源：${window.location.href}`;

// sentry
export const SENTRY_DSN = process.env.DSR_SENTRY_DSN;
