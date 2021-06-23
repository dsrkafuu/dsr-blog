/*! dsr-blog | DSRKafuU (https://dsrkafuu.su) | Copyright (c) Apache-2.0 License */

import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';

import { SECTIONS } from './plugins/constants';
import { logError, logInfo } from './plugins/loggers';
import { getSection } from './plugins/utils';

import ThemeManager from './components/theme';
import zoom from './components/zoom';
import compatibility from './components/compatibility';
import search from './components/search';
import toc from './components/toc';
import prism from './components/prism';
import clipboard from './components/clipboard';
import comment from './components/comment';

const PREF_START = Date.now();
const SECTION = getSection();
const THEME_BTN = 'switch-btn';

// sentry
if (process.env.NODE_ENV === 'production') {
  try {
    Sentry.init({
      dsn: process.env.DSR_SENTRY_DSN,
      integrations: [new Integrations.BrowserTracing()],
      tracesSampleRate: 1.0,
    });
  } catch (e) {
    logError('error init sentry', e);
  }
}

// theme system
const tm = new ThemeManager();
const btn = document.querySelector(`#${THEME_BTN}`);
if (btn) {
  btn.addEventListener('click', () => tm.switchTheme());
}

const works = [];

works.push(zoom());
if (SECTION === SECTIONS.INDEX) {
  works.push(compatibility());
}
if ([SECTIONS.INDEX, SECTIONS.LIST].includes(SECTION)) {
  works.push(search());
}
if ([SECTIONS.FRIENDS, SECTIONS.SINGLE].includes(SECTION)) {
  works.push(comment());
}
if (SECTION === SECTIONS.SINGLE) {
  works.push(toc(), prism(), clipboard());
}

Promise.all(works).then(() => {
  const PERF_END = Date.now();
  logInfo(`all init process done in about ${PERF_END - PREF_START}ms`);
});
