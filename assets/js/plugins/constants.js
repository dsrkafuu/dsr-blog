// scripts
export const SCRIPT_GITALK = 'https://cdn.jsdelivr.net/npm/gitalk@1.7.2/dist/gitalk.min.js';

// dom attributes
export const ATTR_THEME = 'data-theme';
export const ATTR_SECTION = 'data-section';

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
