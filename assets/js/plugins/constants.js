// scripts
export const SCRIPT_GITALK = 'https://cdn.jsdelivr.net/npm/gitalk@1.7.2/dist/gitalk.min.js';
export const SCRIPT_VUE = `https://cdn.jsdelivr.net/npm/vue@3.0.2/dist/vue.global${
  process.env.NODE_ENV === 'development' ? '.' : '.prod.'
}js`;

// dom body data attributes
export const BODY_ATTRIBUTE_THEME = 'data-theme';
export const BODY_ATTRIBUTE_SECTION = 'data-section';

// local storage keys
export const STORAGE_THEME = 'dsr-blog_theme';

// search
export const SEARCH_API_URL = 'https://workers.dsrkafuu.su/gcse-blog';

// gitalk
export const GITALK_CLIENT_ID = process.env.GITALK_CLIENT_ID;
export const GITALK_CLIENT_SECRET = process.env.GITALK_CLIENT_SECRET;
export const GITALK_REPO = 'dsr-blog-comments';
export const GITALK_OWNER = 'dsrkafuu';
export const GITALK_ADMIN = ['dsrkafuu', 'dsrsatori'];

// clipboard
export const COPY_LICENSE = `
----------------------------------------
本站内容采用 CC BY-NC-SA 4.0 进行许可；
商业转载请联系作者授权，非商业转载请注明出处；
来源：${window.location.href}`;

// sentry
export const SENTRY_DSN = process.env.SENTRY_DSN;
