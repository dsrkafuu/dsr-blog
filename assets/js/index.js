import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';
import { logError, logInfo } from './plugins/loggers';
import { SECTIONS, getSection } from './plugins/utils';
import search from './components/search';
import toc from './components/toc';

const SECTION = getSection();

// sentry
if (process.env.NODE_ENV === 'production') {
  try {
    Sentry.init({
      dsn: process.env.HUGO_SENTRY_DSN,
      integrations: [new Integrations.BrowserTracing()],
      tracesSampleRate: 1.0,
    });
  } catch (e) {
    logError('error init sentry', e);
  }
}

// modules
if ([SECTIONS.INDEX, SECTIONS.LIST].includes(SECTION)) {
  search();
  logInfo('search module inited');
}
if (SECTION === SECTIONS.SINGLE) {
  toc();
  logInfo('toc module inited');
}
