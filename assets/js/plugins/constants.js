// scripts and styles
export const SCRIPT_GITALK = 'https://cdn.jsdelivr.net/npm/gitalk@1.7.2/dist/gitalk.min.js';
export const STYLE_GITALK = 'https://cdn.jsdelivr.net/npm/gitalk@1.7.2/dist/gitalk.min.css';
export const SCRIPT_PRISM_LOADER =
  'https://cdn.jsdelivr.net/combine/npm/prismjs@1.23.0/components/prism-core.min.js,npm/prismjs@1.23.0/plugins/autoloader/prism-autoloader.min.js';
export const PRISM_LANGS_PATH = 'https://cdn.jsdelivr.net/npm/prismjs@1.23.0/components/';

// search engine
export const SEARCH_URL = 'https://www.google.com/search';
export const SEARCH_NW = '1';
export const SEARCH_SITE = 'blog.dsrkafuu.su/post';

// dom attributes and ids
export const ATTR_THEME = 'data-theme';
export const ATTR_SECTION = 'data-section';
export const ID_THEME_CTRL = 'ctrl-adjust';
export const ID_TOC_CTRL = 'ctrl-toc';
export const ID_TOC_CONTENT = 'content-toc';
export const ID_SEARCH_CTRL = 'ctrl-search';
export const ID_SEARCH_INPUT = 'input-search';
export const ID_COMMENT_CONTENT = 'comment';
export const ID_COMMENT_LOADING = 'comment-loading';

// local storage keys
export const STORAGE_THEME = 'dsr-blog_theme';

// clipboard
export const COPY_LICENSE = `
----------------------------------------
本站内容采用 CC BY-NC-SA 4.0 进行许可；
商业转载请联系作者授权，非商业转载请注明出处；
来源：${window.location.href}`;

// gitalk
export const GITALK_ID = process.env.DSR_GITALK_ID;
export const GITALK_SECRET = process.env.DSR_GITALK_SECRET;
export const GITALK_REPO = 'dsr-blog-comments';
export const GITALK_OWNER = 'dsrkafuu';
export const GITALK_ADMIN = ['dsrkafuu', 'dsrsatori'];

// sentry
export const SENTRY_DSN = process.env.DSR_SENTRY_DSN;
